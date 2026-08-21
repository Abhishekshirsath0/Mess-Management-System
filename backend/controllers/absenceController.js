import Absence from "../model/absence.js";
import User from "../model/user.js";
import Attendance from "../model/attendance.js";

const normalizeFromDate = (dateInput) => {
  const dateStr =
    typeof dateInput === "string"
      ? dateInput.slice(0, 10)
      : new Date(dateInput).toISOString().slice(0, 10);
  return new Date(`${dateStr}T00:00:00.000Z`);
};

const normalizeToDate = (dateInput) => {
  const dateStr =
    typeof dateInput === "string"
      ? dateInput.slice(0, 10)
      : new Date(dateInput).toISOString().slice(0, 10);
  return new Date(`${dateStr}T23:59:59.999Z`);
};

const syncAttendanceRecords = async (userObj, start, end, mealType = "Both") => {
  const dates = [];
  let curr = new Date(start);
  const finish = new Date(end);

  while (curr <= finish) {
    dates.push(new Date(curr));
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  const selectedMeal = mealType || "Both";

  for (const d of dates) {
    const dateStr = d.toISOString().slice(0, 10);
    const normalizedDate = new Date(`${dateStr}T00:00:00.000Z`);
    const existingRec = await Attendance.findOne({
      userId: userObj._id,
      date: normalizedDate,
    });

    let lunch = false;
    let dinner = false;

    if (selectedMeal === "Lunch") {
      lunch = false;
      dinner = existingRec ? Boolean(existingRec.dinner) : false;
    } else if (selectedMeal === "Dinner") {
      dinner = false;
      lunch = existingRec ? Boolean(existingRec.lunch) : false;
    } else {
      // Both
      lunch = false;
      dinner = false;
    }

    const status = lunch || dinner ? "present" : "absent";

    await Attendance.findOneAndUpdate(
      { userId: userObj._id, date: normalizedDate },
      {
        $set: {
          userName: userObj.Name || userObj.name || "Member",
          status,
          lunch,
          dinner,
          date: normalizedDate,
        },
      },
      { upsert: true, new: true }
    );
  }
};

// Create a new absence range & mark attendance records
export const createAbsence = async (req, res) => {
  try {
    const { userId, fromDate, toDate, mealType, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Member (userId) is required" });
    }
    if (!fromDate || !toDate) {
      return res
        .status(400)
        .json({ message: "Both From Date and To Date are required" });
    }

    const start = normalizeFromDate(fromDate);
    const end = normalizeToDate(toDate);

    if (start > end) {
      return res
        .status(400)
        .json({ message: "From Date cannot be after To Date" });
    }

    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "Selected user not found" });
    }

    const selectedMealType = ["Lunch", "Dinner", "Both"].includes(mealType)
      ? mealType
      : "Both";

    // Update existing overlapping absence record or create a new one
    let absenceDoc = await Absence.findOne({
      userId,
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (absenceDoc) {
      absenceDoc.fromDate = start;
      absenceDoc.toDate = end;
      absenceDoc.mealType = selectedMealType;
      if (reason !== undefined) absenceDoc.reason = reason;
      await absenceDoc.save();
    } else {
      absenceDoc = new Absence({
        userId,
        fromDate: start,
        toDate: end,
        mealType: selectedMealType,
        reason: reason || "",
        createdBy: req.user?.userId || null,
      });
      await absenceDoc.save();
    }

    // Sync Attendance records for each date in range
    await syncAttendanceRecords(userExists, start, end, selectedMealType);

    const populated = await Absence.findById(absenceDoc._id).populate(
      "userId",
      "Name Email Mobile"
    );

    return res.status(201).json({
      message: "Absence range and attendance updated successfully",
      data: populated,
    });
  } catch (error) {
    console.error("Create absence error:", error);
    return res
      .status(500)
      .json({ message: "Failed to save absence range", error: error.message });
  }
};

// Get all absence ranges (or filter by userId)
export const getAbsences = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) {
      filter.userId = userId;
    }

    const list = await Absence.find(filter)
      .populate("userId", "Name Email Mobile Usertype Plan")
      .populate("createdBy", "Name")
      .sort({ fromDate: -1 });

    return res.status(200).json({
      message: "Absence ranges fetched successfully",
      data: list,
    });
  } catch (error) {
    console.error("Get absences error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch absence ranges", error: error.message });
  }
};

// Get absence ranges for a specific user
export const getAbsencesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Absence.find({ userId }).sort({ fromDate: 1 });

    return res.status(200).json({
      message: "User absence ranges fetched successfully",
      data: list,
    });
  } catch (error) {
    console.error("Get user absences error:", error);
    return res.status(500).json({
      message: "Failed to fetch user absence ranges",
      error: error.message,
    });
  }
};

// Update an absence range & re-sync attendance
export const updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate, mealType, reason } = req.body;

    const existing = await Absence.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Absence range not found" });
    }

    const userExists = await User.findById(existing.userId);
    if (!userExists) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    const start = fromDate ? normalizeFromDate(fromDate) : existing.fromDate;
    const end = toDate ? normalizeToDate(toDate) : existing.toDate;
    const selectedMealType = mealType || existing.mealType || "Both";

    if (start > end) {
      return res
        .status(400)
        .json({ message: "From Date cannot be after To Date" });
    }

    existing.fromDate = start;
    existing.toDate = end;
    existing.mealType = selectedMealType;
    if (reason !== undefined) existing.reason = reason;

    await existing.save();
    await syncAttendanceRecords(userExists, start, end, selectedMealType);

    const populated = await Absence.findById(existing._id).populate(
      "userId",
      "Name Email Mobile"
    );

    return res.status(200).json({
      message: "Absence range updated successfully",
      data: populated,
    });
  } catch (error) {
    console.error("Update absence error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update absence range", error: error.message });
  }
};

// Delete an absence range
export const deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Absence.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Absence range not found" });
    }

    return res.status(200).json({
      message: "Absence range deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete absence error:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete absence range", error: error.message });
  }
};

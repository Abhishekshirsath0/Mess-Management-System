import Absence from "../model/absence.js";
import User from "../model/user.js";

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

// Create a new absence range
export const createAbsence = async (req, res) => {
  try {
    const { userId, fromDate, toDate, reason } = req.body;

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

    // Check for overlapping range for this user
    const overlap = await Absence.findOne({
      userId,
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlap) {
      return res.status(400).json({
        message:
          "An absence range already overlaps with the selected dates for this member",
      });
    }

    const newAbsence = new Absence({
      userId,
      fromDate: start,
      toDate: end,
      reason: reason || "",
      createdBy: req.user?.userId || null,
    });

    await newAbsence.save();
    const populated = await Absence.findById(newAbsence._id).populate(
      "userId",
      "Name Email Mobile"
    );

    return res.status(201).json({
      message: "Absence range saved successfully",
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

// Update an absence range
export const updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate, reason } = req.body;

    const existing = await Absence.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Absence range not found" });
    }

    const start = fromDate ? normalizeFromDate(fromDate) : existing.fromDate;
    const end = toDate ? normalizeToDate(toDate) : existing.toDate;

    if (start > end) {
      return res
        .status(400)
        .json({ message: "From Date cannot be after To Date" });
    }

    // Check overlap excluding current record
    const overlap = await Absence.findOne({
      _id: { $ne: id },
      userId: existing.userId,
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlap) {
      return res.status(400).json({
        message:
          "Updated dates overlap with another existing absence range for this member",
      });
    }

    existing.fromDate = start;
    existing.toDate = end;
    if (reason !== undefined) existing.reason = reason;

    await existing.save();
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

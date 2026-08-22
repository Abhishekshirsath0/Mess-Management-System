import MealAssignment from "../model/mealAssignment.js";
import User from "../model/user.js";

// Assign or update a user's recurring meal assignment (Admin)
export const assignMeal = async (req, res) => {
  try {
    const { userId, mealType } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!["Lunch", "Dinner", "Both"].includes(mealType)) {
      return res.status(400).json({
        message: "Invalid mealType. Allowed values: Lunch, Dinner, Both",
      });
    }

    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let assignment = await MealAssignment.findOne({ userId });

    if (assignment) {
      assignment.mealType = mealType;
      assignment.status = "active";
      assignment.startDate = new Date();
      assignment.updatedBy = req.user?.userId || null;
      await assignment.save();
    } else {
      assignment = await MealAssignment.create({
        userId,
        mealType,
        status: "active",
        startDate: new Date(),
        updatedBy: req.user?.userId || null,
      });
    }

    return res.status(200).json({
      message: "Recurring meal assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("ASSIGN MEAL ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Reset/remove a user's active recurring meal assignment (Admin)
export const resetMeal = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const assignment = await MealAssignment.findOneAndUpdate(
      { userId },
      { status: "inactive", updatedBy: req.user?.userId || null },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Meal assignment not found" });
    }

    return res.status(200).json({
      message: "Recurring meal assignment reset successfully",
      assignment,
    });
  } catch (error) {
    console.error("RESET MEAL ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get current user's active meal assignment
export const getUserMealAssignment = async (req, res) => {
  try {
    const { userId } = req.params;

    const assignment = await MealAssignment.findOne({ userId, status: "active" });

    if (!assignment) {
      return res.status(200).json({
        userId,
        status: "inactive",
        mealType: null,
      });
    }

    return res.status(200).json(assignment);
  } catch (error) {
    console.error("GET USER MEAL ASSIGNMENT ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all meal assignments (Admin)
export const getAllMealAssignments = async (req, res) => {
  try {
    const assignments = await MealAssignment.find().populate("userId", "Name Email Mobile");
    return res.status(200).json(assignments);
  } catch (error) {
    console.error("GET ALL MEAL ASSIGNMENTS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

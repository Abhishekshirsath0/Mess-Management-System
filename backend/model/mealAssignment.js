import mongoose, { Schema } from "mongoose";

const mealAssignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    mealType: {
      type: String,
      enum: ["Lunch", "Dinner", "Both"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

mealAssignmentSchema.index({ userId: 1, status: 1 });

const MealAssignment =
  mongoose.models.MealAssignment ||
  mongoose.model("MealAssignment", mealAssignmentSchema);

export default MealAssignment;

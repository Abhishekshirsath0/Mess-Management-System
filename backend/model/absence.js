import mongoose, { Schema } from "mongoose";

const absenceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["Lunch", "Dinner", "Both"],
      default: "Both",
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Fast query lookup for user absence date ranges
absenceSchema.index({ userId: 1, fromDate: 1, toDate: 1 });

const Absence =
  mongoose.models.Absence || mongoose.model("Absence", absenceSchema);

export default Absence;

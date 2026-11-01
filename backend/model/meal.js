import mongoose, { Schema } from "mongoose";

const menuSchema = new Schema(
  {
    veg: { type: [String], default: [] },
    nonVeg: { type: [String], default: [] },
  },
  { _id: false }
);

const mealSchema = new Schema(
  {
    messId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
      trim: true,
    },
    weekday: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
      trim: true,
    },
    lunch: {
      type: menuSchema,
      default: () => ({ veg: [], nonVeg: [] }),
    },
    dinner: {
      type: menuSchema,
      default: () => ({ veg: [], nonVeg: [] }),
    },
    // Optional date retained for backward compatibility / audit tracking
    date: {
      type: Date,
      required: false,
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

// Unique schedule entry per weekday per mess owner to prevent duplicate schedule entries
mealSchema.index({ messId: 1, day: 1 }, { unique: true });
mealSchema.index({ messId: 1, weekday: 1 });
mealSchema.index({ day: 1 });
mealSchema.index({ weekday: 1 });

// Ensure day and weekday are always synchronized
mealSchema.pre("validate", function (next) {
  if (this.day && !this.weekday) {
    this.weekday = this.day;
  } else if (this.weekday && !this.day) {
    this.day = this.weekday;
  }
  next();
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;
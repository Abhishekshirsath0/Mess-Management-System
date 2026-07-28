import mongoose, { Schema } from "mongoose";

const menuSchema = {
  veg: { type: [String], default: [] },
  nonVeg: { type: [String], default: [] },
};

const mealSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    lunch: menuSchema,
    dinner: menuSchema,
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;
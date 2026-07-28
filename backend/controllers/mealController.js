import Meal from "../model/meal.js";

export const postMealdata = async (req, res) => {
  try {
    const { date, mealType, veg, nonVeg } = req.body;

    if (!date || !mealType) {
      return res.status(400).json({ message: "date and mealType are required" });
    }

    const field = mealType.toLowerCase() === "dinner" ? "dinner" : "lunch";

    const meal = await Meal.findOneAndUpdate(
      { date },
      { $set: { [field]: { veg, nonVeg } } },
      { new: true, upsert: true }
    );

    return res.status(201).json(meal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMealdata = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const meals = await Meal.find(filter).sort({ date: 1 });
    return res.status(200).json(meals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
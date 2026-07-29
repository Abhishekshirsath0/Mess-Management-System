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
    let filter = {};
    if (date) {
      const dateStr = typeof date === "string" ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10);
      const start = new Date(`${dateStr}T00:00:00.000Z`);
      const end = new Date(`${dateStr}T23:59:59.999Z`);
      filter = { date: { $gte: start, $lte: end } };
    }
    const meals = await Meal.find(filter).sort({ date: 1 });
    return res.status(200).json(meals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTodayMeal = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const start = new Date(`${todayStr}T00:00:00.000Z`);
    const end = new Date(`${todayStr}T23:59:59.999Z`);

    const meal = await Meal.findOne({ date: { $gte: start, $lte: end } });
    return res.status(200).json(meal || { date: todayStr, lunch: { veg: [], nonVeg: [] }, dinner: { veg: [], nonVeg: [] } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
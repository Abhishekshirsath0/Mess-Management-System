import mongoose from "mongoose";
import Meal from "../model/meal.js";
import User from "../model/user.js";

const VALID_WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_ORDER = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

// Formats date object to YYYY-MM-DD
const formatLocalDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Normalizes input weekday string (e.g. "monday" -> "Monday")
const normalizeWeekday = (dayStr) => {
  if (!dayStr || typeof dayStr !== "string") return null;
  const trimmed = dayStr.trim().toLowerCase();
  const match = VALID_WEEKDAYS.find((d) => d.toLowerCase() === trimmed);
  return match || null;
};

// Extracts weekday name from date input safely without timezone shifting
const getWeekdayFromDate = (dateInput) => {
  if (!dateInput) {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[now.getDay()];
  }

  if (typeof dateInput === "string") {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      const dateObj = new Date(Date.UTC(+y, +m - 1, +d, 12, 0, 0));
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[dateObj.getUTCDay()];
    }
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[d.getDay()];
};

// Cleans array of menu item strings (trims whitespace, filters empty strings)
const cleanMenuItems = (items) => {
  if (!items) return [];
  if (Array.isArray(items)) {
    return items
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
  }
  if (typeof items === "string") {
    return items
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }
  return [];
};

// Resolves the appropriate messId based on request context
const resolveMessId = async (req, fallbackToUser = true) => {
  // 1. Explicit query or body messId
  const candidateId = req.query?.messId || req.body?.messId;
  if (candidateId && mongoose.Types.ObjectId.isValid(candidateId)) {
    return new mongoose.Types.ObjectId(candidateId);
  }

  // 2. If authenticated user is admin, their userId is their messId
  if (req.user?.role === "admin" && req.user?.userId) {
    return new mongoose.Types.ObjectId(req.user.userId);
  }

  // 3. If authenticated user is a regular user, check if they belong to a mess
  if (fallbackToUser && req.user?.userId) {
    try {
      const dbUser = await User.findById(req.user.userId).select("messId");
      if (dbUser?.messId) {
        return dbUser.messId;
      }
    } catch {
      // ignore lookup error
    }
  }

  return null;
};

// ==================== POST /api/meal =======================
// Saves or updates a recurring weekly meal schedule entry
export const postMealdata = async (req, res) => {
  try {
    const { day, weekday, date, mealType, veg, nonVeg, lunch, dinner, messId: customMessId } =
      req.body;

    // Determine target weekday
    let targetDay =
      normalizeWeekday(day) ||
      normalizeWeekday(weekday) ||
      getWeekdayFromDate(date);

    if (!targetDay) {
      return res.status(400).json({
        message:
          "A valid weekday ('Monday' through 'Sunday') or valid date is required.",
      });
    }

    // Determine messId
    let messId = null;
    if (customMessId && mongoose.Types.ObjectId.isValid(customMessId)) {
      messId = new mongoose.Types.ObjectId(customMessId);
    } else if (req.user?.role === "admin" && req.user?.userId) {
      messId = new mongoose.Types.ObjectId(req.user.userId);
    }

    const typeStr = (mealType || "Lunch").toLowerCase();
    const updateQuery = {
      $set: {
        day: targetDay,
        weekday: targetDay,
        messId: messId,
        updatedBy: req.user?.userId || null,
      },
    };

    if (date) {
      updateQuery.$set.date = new Date(date);
    }

    // Handle full menu objects if provided
    if (lunch && typeof lunch === "object") {
      updateQuery.$set["lunch.veg"] = cleanMenuItems(lunch.veg);
      updateQuery.$set["lunch.nonVeg"] = cleanMenuItems(lunch.nonVeg);
    }
    if (dinner && typeof dinner === "object") {
      updateQuery.$set["dinner.veg"] = cleanMenuItems(dinner.veg);
      updateQuery.$set["dinner.nonVeg"] = cleanMenuItems(dinner.nonVeg);
    }

    // Handle individual mealType update (Lunch, Dinner, or Both)
    if (typeStr === "lunch") {
      updateQuery.$set["lunch.veg"] = cleanMenuItems(veg);
      updateQuery.$set["lunch.nonVeg"] = cleanMenuItems(nonVeg);
    } else if (typeStr === "dinner") {
      updateQuery.$set["dinner.veg"] = cleanMenuItems(veg);
      updateQuery.$set["dinner.nonVeg"] = cleanMenuItems(nonVeg);
    } else if (typeStr === "both") {
      updateQuery.$set["lunch.veg"] = cleanMenuItems(veg);
      updateQuery.$set["lunch.nonVeg"] = cleanMenuItems(nonVeg);
      updateQuery.$set["dinner.veg"] = cleanMenuItems(veg);
      updateQuery.$set["dinner.nonVeg"] = cleanMenuItems(nonVeg);
    }

    const filter = { day: targetDay, messId: messId };

    const meal = await Meal.findOneAndUpdate(filter, updateQuery, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return res.status(200).json(meal);
  } catch (error) {
    console.error("[postMealdata Error]:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate schedule entry for this weekday and mess.",
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

// ==================== GET /api/meal =======================
// Retrieves meals: all 7 recurring days, or filtered by day/date/mess
export const getMealdata = async (req, res) => {
  try {
    const { date, day, weekday, messId: queryMessId } = req.query;
    const messId = await resolveMessId(req);

    let filter = {};

    // Specific day or date requested
    const requestedDay =
      normalizeWeekday(day) ||
      normalizeWeekday(weekday) ||
      (date ? getWeekdayFromDate(date) : null);

    if (requestedDay) {
      filter.$or = [{ day: requestedDay }, { weekday: requestedDay }];
    }

    // Apply mess scoping
    if (messId) {
      // Find meals for this specific mess, or fall back to system default if none exist
      const messSpecificFilter = { ...filter, messId };
      let meals = await Meal.find(messSpecificFilter);

      if (meals.length === 0) {
        // Fallback to shared/default schedule (messId: null) if mess has not configured meals yet
        meals = await Meal.find({ ...filter, messId: null });
      }

      meals.sort((a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99));
      return res.status(200).json(meals);
    }

    // If no mess specified or resolved, query without mess restriction
    const meals = await Meal.find(filter);
    meals.sort((a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99));
    return res.status(200).json(meals);
  } catch (error) {
    console.error("[getMealdata Error]:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ==================== GET /api/meal/today =======================
// Returns the recurring meal for today's weekday (or for the weekday of requested date)
export const getTodayMeal = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const todayWeekday = getWeekdayFromDate(dateParam);
    const dateStr =
      typeof dateParam === "string"
        ? dateParam.slice(0, 10)
        : formatLocalDate(new Date());

    const messId = await resolveMessId(req);

    let meal = null;
    if (messId) {
      meal = await Meal.findOne({
        messId,
        $or: [{ day: todayWeekday }, { weekday: todayWeekday }],
      });
      if (!meal) {
        // Fallback to shared default
        meal = await Meal.findOne({
          messId: null,
          $or: [{ day: todayWeekday }, { weekday: todayWeekday }],
        });
      }
    } else {
      meal = await Meal.findOne({
        $or: [{ day: todayWeekday }, { weekday: todayWeekday }],
      });
    }

    if (meal) {
      return res.status(200).json({
        _id: meal._id,
        messId: meal.messId,
        day: meal.day,
        weekday: meal.weekday,
        date: dateStr,
        lunch: meal.lunch || { veg: [], nonVeg: [] },
        dinner: meal.dinner || { veg: [], nonVeg: [] },
      });
    }

    return res.status(200).json({
      day: todayWeekday,
      weekday: todayWeekday,
      date: dateStr,
      lunch: { veg: [], nonVeg: [] },
      dinner: { veg: [], nonVeg: [] },
    });
  } catch (error) {
    console.error("[getTodayMeal Error]:", error);
    return res.status(500).json({ message: error.message });
  }
};
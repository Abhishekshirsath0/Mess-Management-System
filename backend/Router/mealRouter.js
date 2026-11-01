import express from "express";
import * as mealController from "../controllers/mealController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const mealRouter = express.Router();

// Admin-only route - create or update weekly recurring meals
mealRouter.post("/", verifyToken, verifyAdmin, mealController.postMealdata);

// Protected routes - authentication required
mealRouter.get("/today", verifyToken, mealController.getTodayMeal);
mealRouter.get("/schedule", verifyToken, mealController.getMealdata);
mealRouter.get("/day/:day", verifyToken, (req, res) => {
  req.query.day = req.params.day;
  return mealController.getMealdata(req, res);
});
mealRouter.get("/", verifyToken, mealController.getMealdata);

export default mealRouter;

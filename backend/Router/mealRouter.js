import express from "express";
import * as mealController from "../controllers/mealController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const mealRouter = express.Router();

// Admin-only route - create meals
mealRouter.post("/", verifyToken, verifyAdmin, mealController.postMealdata);

// Protected routes - authentication required
mealRouter.get("/today", verifyToken, mealController.getTodayMeal);
mealRouter.get("/", verifyToken, mealController.getMealdata);

export default mealRouter;

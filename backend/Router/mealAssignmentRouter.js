import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import {
  assignMeal,
  resetMeal,
  getUserMealAssignment,
  getAllMealAssignments,
} from "../controllers/mealAssignmentController.js";

const mealAssignmentRouter = express.Router();

// Admin routes
mealAssignmentRouter.post("/", verifyToken, verifyAdmin, assignMeal);
mealAssignmentRouter.post("/reset", verifyToken, verifyAdmin, resetMeal);
mealAssignmentRouter.get("/", verifyToken, verifyAdmin, getAllMealAssignments);

// User / Admin route to view individual assignment
mealAssignmentRouter.get("/user/:userId", verifyToken, getUserMealAssignment);

export default mealAssignmentRouter;

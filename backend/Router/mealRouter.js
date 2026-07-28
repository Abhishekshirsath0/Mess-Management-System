import express from "express";
import * as mealController from "../controllers/mealController.js";

const mealRouter = express.Router();

mealRouter.post("/", mealController.postMealdata);
mealRouter.get("/", mealController.getMealdata);

export default mealRouter;
import express from "express";
import * as authController from "../controllers/authController.js";

const authRouter = express.Router();

// Public routes for password reset flow
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password/:token", authController.resetPassword);

export default authRouter;

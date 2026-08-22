import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

//no authentication required
userRouter.post("/", userController.postUserdata); // Register
userRouter.post("/login", userController.loginUser); // Login
userRouter.post("/forgot-password", authController.forgotPassword);
userRouter.post("/reset-password/:token", authController.resetPassword);

// authentication required
userRouter.get("/", verifyToken, userController.getUserdata);
userRouter.put("/:id", verifyToken, userController.updateUser);
userRouter.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

export default userRouter;

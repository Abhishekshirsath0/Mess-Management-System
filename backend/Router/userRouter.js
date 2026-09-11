import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken, verifyAdmin, verifyUserOrAdmin } from "../middleware/auth.js";
import { rateLimit } from "express-rate-limit";

const userRouter = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    limit: 20,  
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
});

// Public routes
userRouter.post("/", userController.postUserdata); // Register
userRouter.post("/login", limiter, userController.loginUser); // Login

// Protected routes
userRouter.get("/", verifyToken, verifyAdmin, userController.getUserdata);
userRouter.put("/:id", verifyToken, verifyUserOrAdmin, userController.updateUser);
userRouter.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

export default userRouter;


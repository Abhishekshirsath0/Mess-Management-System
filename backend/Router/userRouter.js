import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { rateLimit } from "express-rate-limit";


const userRouter = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    limit: 20,  
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
});

//no authentication required
userRouter.post("/", userController.postUserdata); // Register
userRouter.post("/login", limiter, userController.loginUser); // Login
userRouter.post("/forgot-password", limiter, authController.forgotPassword);
userRouter.post("/reset-password/:token", limiter, authController.resetPassword);

// authentication required
userRouter.get("/", verifyToken, userController.getUserdata);
userRouter.put("/:id", verifyToken, userController.updateUser);
userRouter.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

export default userRouter;

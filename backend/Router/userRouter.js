import express from "express";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", userController.postUserdata);
userRouter.post("/login", userController.loginUser);
userRouter.get("/", userController.getUserdata);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
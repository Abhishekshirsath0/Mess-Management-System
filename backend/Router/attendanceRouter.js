import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import { verifyToken, verifyAdmin, verifyUserOrAdmin } from "../middleware/auth.js";

const attendanceRouter = express.Router();

attendanceRouter.get("/history", verifyToken, verifyAdmin, attendanceController.getAttendanceHistory);
attendanceRouter.get("/history/:userId", verifyToken, verifyUserOrAdmin, attendanceController.getUserAttendanceHistory);
attendanceRouter.get("/", attendanceController.getAttendanceByDate);
attendanceRouter.get("/user/:userId", attendanceController.getUserAttendanceStats);
attendanceRouter.post("/", attendanceController.postAttendence);
attendanceRouter.put("/", attendanceController.UpdateAttendence);

export default attendanceRouter;

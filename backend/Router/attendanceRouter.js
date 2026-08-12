import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import {
  verifyToken,
  verifyAdmin,
  verifyUserOrAdmin,
} from "../middleware/auth.js";

const attendanceRouter = express.Router();

// Admin routes
attendanceRouter.get(
  "/history",
  verifyToken,
  verifyAdmin,
  attendanceController.getAttendanceHistory,
);
attendanceRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  attendanceController.postAttendence,
);
attendanceRouter.put(
  "/",
  verifyToken,
  verifyAdmin,
  attendanceController.UpdateAttendence,
);

// User accessible routes
attendanceRouter.get(
  "/user/:userId",
  verifyToken,
  verifyUserOrAdmin,
  attendanceController.getUserAttendanceStats,
);
attendanceRouter.get(
  "/history/:userId",
  verifyToken,
  verifyUserOrAdmin,
  attendanceController.getUserAttendanceHistory,
);
attendanceRouter.get(
  "/",
  verifyToken,
  verifyAdmin,
  attendanceController.getAttendanceByDate,
);

export default attendanceRouter;

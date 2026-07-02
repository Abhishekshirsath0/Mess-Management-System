import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.get("/" , attendanceController.getAttendanceByDate)
attendanceRouter.post("/", attendanceController.postAttendence);
attendanceRouter.put("/", attendanceController.UpdateAttendence);

export default attendanceRouter;
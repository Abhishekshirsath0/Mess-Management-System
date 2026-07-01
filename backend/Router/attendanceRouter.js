import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/", attendanceController.postAttendence);

export default attendanceRouter;
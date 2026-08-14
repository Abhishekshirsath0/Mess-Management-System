import express from "express";
import * as absenceController from "../controllers/absenceController.js";
import {
  verifyToken,
  verifyAdmin,
  verifyUserOrAdmin,
} from "../middleware/auth.js";

const absenceRouter = express.Router();

// Admin-only management routes
absenceRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  absenceController.createAbsence
);

absenceRouter.get(
  "/",
  verifyToken,
  verifyAdmin,
  absenceController.getAbsences
);

absenceRouter.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  absenceController.updateAbsence
);

absenceRouter.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  absenceController.deleteAbsence
);

// User or Admin accessible route
absenceRouter.get(
  "/user/:userId",
  verifyToken,
  verifyUserOrAdmin,
  absenceController.getAbsencesByUserId
);

export default absenceRouter;

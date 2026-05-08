import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { ROLES } from "../models/constants.js";
import {
  getMyClasses,
  putAttendance,
  putGrade,
  upsertAttendanceSchema,
  upsertGradeSchema,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(ROLES.TEACHER));

router.get("/classes", getMyClasses);
router.put("/grades", validateBody(upsertGradeSchema), putGrade);
router.put("/attendance", validateBody(upsertAttendanceSchema), putAttendance);

export default router;


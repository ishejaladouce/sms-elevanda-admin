import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { ROLES } from "../models/constants.js";
import { getUsers, patchVerifyDevice } from "../controllers/adminUsers.controller.js";
import { getStats } from "../controllers/adminDashboard.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createClassSchema,
  getClasses,
  getTeachers,
  patchClass,
  postClass,
  removeClass,
  updateClassSchema,
} from "../controllers/adminClasses.controller.js";
import { assignClassSchema, getStudents, patchAssignClass } from "../controllers/adminStudents.controller.js";
import { getFees } from "../controllers/adminFees.controller.js";
import { getGrades } from "../controllers/adminGrades.controller.js";
import { getAttendance } from "../controllers/adminAttendance.controller.js";
import {
  createScheduleSchema,
  getClassSchedules,
  patchSchedule,
  postClassSchedule,
  removeSchedule,
  updateScheduleSchema,
} from "../controllers/adminSchedules.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.get("/users", getUsers);
router.patch("/users/:id/verify-device", patchVerifyDevice);
router.get("/dashboard/stats", getStats);

router.get("/teachers", getTeachers);
router.get("/students", getStudents);
router.patch("/students/:id/class", validateBody(assignClassSchema), patchAssignClass);
router.get("/fees", getFees);
router.get("/grades", getGrades);
router.get("/attendance", getAttendance);
router.get("/classes", getClasses);
router.post("/classes", validateBody(createClassSchema), postClass);
router.patch("/classes/:id", validateBody(updateClassSchema), patchClass);
router.delete("/classes/:id", removeClass);
router.get("/classes/:classId/schedules", getClassSchedules);
router.post("/classes/:classId/schedules", validateBody(createScheduleSchema), postClassSchedule);
router.patch("/schedules/:scheduleId", validateBody(updateScheduleSchema), patchSchedule);
router.delete("/schedules/:scheduleId", removeSchedule);

export default router;


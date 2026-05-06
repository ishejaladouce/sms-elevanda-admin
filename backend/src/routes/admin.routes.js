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
import { getStudents } from "../controllers/adminStudents.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.get("/users", getUsers);
router.patch("/users/:id/verify-device", patchVerifyDevice);
router.get("/dashboard/stats", getStats);

router.get("/teachers", getTeachers);
router.get("/students", getStudents);
router.get("/classes", getClasses);
router.post("/classes", validateBody(createClassSchema), postClass);
router.patch("/classes/:id", validateBody(updateClassSchema), patchClass);
router.delete("/classes/:id", removeClass);

export default router;


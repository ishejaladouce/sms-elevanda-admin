import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { ROLES } from "../models/constants.js";
import { getUsers, patchVerifyDevice } from "../controllers/adminUsers.controller.js";
import { getStats } from "../controllers/adminDashboard.controller.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

router.get("/users", getUsers);
router.patch("/users/:id/verify-device", patchVerifyDevice);
router.get("/dashboard/stats", getStats);

export default router;


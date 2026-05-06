import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { getDashboardStats } from "../services/adminDashboard.service.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  return ok(res, "Dashboard stats", { stats });
});


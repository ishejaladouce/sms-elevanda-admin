import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { toUserSafeDto } from "../dtos/user.dto.js";
import { listUsers, verifyDevice } from "../services/adminUsers.service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();
  return ok(res, "Users", { items: users.map(toUserSafeDto) });
});

export const patchVerifyDevice = asyncHandler(async (req, res) => {
  const user = await verifyDevice(req.params.id);
  return ok(res, "Device verified", { user: toUserSafeDto(user) });
});


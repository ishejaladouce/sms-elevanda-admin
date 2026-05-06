import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/response.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/jwt.js";
import { toUserSafeDto } from "../dtos/user.dto.js";
import { ROLES } from "../models/constants.js";
import { loginStaff, registerStaff } from "../services/auth.service.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([ROLES.ADMIN, ROLES.TEACHER]),
  deviceId: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceId: z.string().min(3),
});

export const register = asyncHandler(async (req, res) => {
  const user = await registerStaff(req.body);
  return created(res, "Registered. Wait for device verification.", { user: toUserSafeDto(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginStaff(req.body);
  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  setAuthCookie(res, token);
  return ok(res, "Login successful", { user: toUserSafeDto(user) });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  return ok(res, "Logged out", null);
});


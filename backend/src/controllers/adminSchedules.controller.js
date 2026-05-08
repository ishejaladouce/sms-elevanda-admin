import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/response.js";
import {
  createSchedule,
  deleteSchedule,
  listSchedules,
  updateSchedule,
} from "../services/adminSchedules.service.js";

const timeString = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Expected HH:MM")
  .transform((s) => s.trim());

export const createScheduleSchema = z
  .object({
    subject: z.string().min(2).max(80).transform((s) => s.trim()),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: timeString,
    endTime: timeString,
  })
  .refine((v) => v.startTime < v.endTime, { message: "startTime must be before endTime" });

export const updateScheduleSchema = z
  .object({
    subject: z.string().min(2).max(80).transform((s) => s.trim()).optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    startTime: timeString.optional(),
    endTime: timeString.optional(),
  })
  .refine(
    (v) => (v.startTime && v.endTime ? v.startTime < v.endTime : true),
    { message: "startTime must be before endTime" }
  );

export const getClassSchedules = asyncHandler(async (req, res) => {
  const items = await listSchedules(req.params.classId);
  return ok(res, "Schedules", { items });
});

export const postClassSchedule = asyncHandler(async (req, res) => {
  const item = await createSchedule(req.params.classId, req.body);
  return created(res, "Schedule created", { item });
});

export const patchSchedule = asyncHandler(async (req, res) => {
  const item = await updateSchedule(req.params.scheduleId, req.body);
  return ok(res, "Schedule updated", { item });
});

export const removeSchedule = asyncHandler(async (req, res) => {
  await deleteSchedule(req.params.scheduleId);
  return ok(res, "Schedule deleted", null);
});


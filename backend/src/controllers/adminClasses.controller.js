import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, created } from "../utils/response.js";
import {
  createClass,
  deleteClass,
  listClasses,
  listTeachers,
  updateClass,
} from "../services/adminClasses.service.js";

export const createClassSchema = z.object({
  name: z.string().min(2),
  teacherId: z.string().optional(),
});

export const updateClassSchema = z.object({
  name: z.string().min(2).optional(),
  teacherId: z.string().optional().nullable(),
});

export const getClasses = asyncHandler(async (req, res) => {
  const items = await listClasses();
  return ok(res, "Classes", { items });
});

export const postClass = asyncHandler(async (req, res) => {
  const item = await createClass(req.body);
  return created(res, "Class created", { item });
});

export const patchClass = asyncHandler(async (req, res) => {
  const item = await updateClass(req.params.id, req.body);
  return ok(res, "Class updated", { item });
});

export const removeClass = asyncHandler(async (req, res) => {
  await deleteClass(req.params.id);
  return ok(res, "Class deleted", null);
});

export const getTeachers = asyncHandler(async (req, res) => {
  const items = await listTeachers();
  const safe = items.map((t) => ({
    id: t.id,
    userId: t.userId,
    name: t.user?.name,
    email: t.user?.email,
  }));
  return ok(res, "Teachers", { items: safe });
});


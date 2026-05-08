import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { listMyClasses, upsertAttendance, upsertGrade } from "../services/teacher.service.js";

export const upsertGradeSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(1).max(80).transform((s) => s.trim()),
  term: z.string().min(1).max(40).transform((s) => s.trim()),
  score: z.coerce.number().min(0).max(100),
});

export const upsertAttendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.coerce.date(),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
});

export const getMyClasses = asyncHandler(async (req, res) => {
  const teacher = await listMyClasses(req.user.sub);
  const items = (teacher.classes || []).map((c) => ({
    id: c.id,
    name: c.name,
    students: (c.students || []).map((s) => ({
      id: s.id,
      admissionNumber: s.admissionNumber,
      name: s.user?.name,
    })),
  }));
  return ok(res, "My classes", { items });
});

export const putGrade = asyncHandler(async (req, res) => {
  const grade = await upsertGrade({ teacherUserId: req.user.sub, ...req.body });
  return ok(res, "Grade saved", { grade });
});

export const putAttendance = asyncHandler(async (req, res) => {
  const attendance = await upsertAttendance({ teacherUserId: req.user.sub, ...req.body });
  return ok(res, "Attendance saved", { attendance });
});


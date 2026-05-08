import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { assignStudentToClass, listStudents } from "../services/adminStudents.service.js";

export const assignClassSchema = z.object({
  classId: z.string().optional().nullable(),
});

export const getStudents = asyncHandler(async (req, res) => {
  const students = await listStudents();
  const items = students.map((s) => ({
    id: s.id,
    admissionNumber: s.admissionNumber,
    studentName: s.user?.name,
    studentEmail: s.user?.email,
    classId: s.classId || null,
    className: s.class?.name || null,
    parentName: s.parent?.user?.name || null,
    parentEmail: s.parent?.user?.email || null,
  }));
  return ok(res, "Students", { items });
});

export const patchAssignClass = asyncHandler(async (req, res) => {
  const classId = typeof req.body.classId === "string" ? req.body.classId.trim() : req.body.classId;
  const updated = await assignStudentToClass(req.params.id, classId);
  return ok(res, "Student updated", {
    student: {
      id: updated.id,
      admissionNumber: updated.admissionNumber,
      studentName: updated.user?.name,
      studentEmail: updated.user?.email,
      classId: updated.classId || null,
      className: updated.class?.name || null,
      parentName: updated.parent?.user?.name || null,
      parentEmail: updated.parent?.user?.email || null,
    },
  });
});


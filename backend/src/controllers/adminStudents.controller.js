import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { listStudents } from "../services/adminStudents.service.js";

export const getStudents = asyncHandler(async (req, res) => {
  const students = await listStudents();
  const items = students.map((s) => ({
    id: s.id,
    admissionNumber: s.admissionNumber,
    studentName: s.user?.name,
    studentEmail: s.user?.email,
    className: s.class?.name || null,
    parentName: s.parent?.user?.name || null,
    parentEmail: s.parent?.user?.email || null,
  }));
  return ok(res, "Students", { items });
});


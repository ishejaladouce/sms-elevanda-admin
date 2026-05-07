import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { listGrades } from "../services/adminGrades.service.js";

export const getGrades = asyncHandler(async (req, res) => {
  const { classId, term, subject } = req.query;
  const grades = await listGrades({ classId, term, subject });

  const items = grades.map((g) => ({
    id: g.id,
    updatedAt: g.updatedAt,
    subject: g.subject,
    term: g.term,
    score: g.score,
    updatedBy: g.updatedBy,
    studentId: g.studentId,
    admissionNumber: g.student?.admissionNumber,
    studentName: g.student?.user?.name,
    classId: g.student?.class?.id || null,
    className: g.student?.class?.name || null,
  }));

  return ok(res, "Grades", { items });
});


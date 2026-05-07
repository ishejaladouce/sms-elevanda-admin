import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { listAttendance } from "../services/adminAttendance.service.js";

export const getAttendance = asyncHandler(async (req, res) => {
  const { classId, dateFrom, dateTo, status } = req.query;
  const records = await listAttendance({ classId, dateFrom, dateTo, status });

  const items = records.map((a) => ({
    id: a.id,
    date: a.date,
    status: a.status,
    studentId: a.studentId,
    admissionNumber: a.student?.admissionNumber,
    studentName: a.student?.user?.name,
    classId: a.student?.class?.id || null,
    className: a.student?.class?.name || null,
  }));

  return ok(res, "Attendance", { items });
});


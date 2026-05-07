import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { listFeePayments } from "../services/adminFees.service.js";

export const getFees = asyncHandler(async (req, res) => {
  const payments = await listFeePayments();
  const items = payments.map((p) => ({
    id: p.id,
    createdAt: p.createdAt,
    amount: p.amount,
    type: p.type,
    balance: p.balance,
    note: p.note,
    studentId: p.studentId,
    admissionNumber: p.student?.admissionNumber,
    studentName: p.student?.user?.name,
    className: p.student?.class?.name || null,
  }));

  return ok(res, "Fee payments", { items });
});


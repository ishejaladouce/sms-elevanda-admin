import { prisma } from "../config/prisma.js";

export async function getDashboardStats() {
  const [students, teachers] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
  ]);

  const feeAgg = await prisma.feePayment.aggregate({
    _sum: { amount: true },
    where: { type: "DEPOSIT" },
  });
  const feeCollection = feeAgg._sum.amount ?? 0;

  const attendanceTotal = await prisma.attendance.count();
  const attendancePresent = await prisma.attendance.count({
    where: { status: "PRESENT" },
  });

  const attendanceRate =
    attendanceTotal === 0 ? 0 : Math.round((attendancePresent / attendanceTotal) * 1000) / 10;

  return {
    students,
    teachers,
    feeCollection,
    attendanceRate,
  };
}


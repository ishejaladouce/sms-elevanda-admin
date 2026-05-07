import { prisma } from "../config/prisma.js";

export async function listAttendance({ classId, dateFrom, dateTo, status } = {}) {
  const where = {
    ...(status ? { status } : {}),
    ...(classId ? { student: { classId } } : {}),
  };

  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  return prisma.attendance.findMany({
    where,
    orderBy: [{ date: "desc" }],
    include: {
      student: {
        include: {
          user: true,
          class: true,
        },
      },
    },
  });
}


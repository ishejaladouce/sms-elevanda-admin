import { prisma } from "../config/prisma.js";

export async function listGrades({ classId, term, subject } = {}) {
  const where = {
    ...(term ? { term } : {}),
    ...(subject ? { subject } : {}),
    ...(classId ? { student: { classId } } : {}),
  };

  return prisma.grade.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
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


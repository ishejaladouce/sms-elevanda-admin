import { prisma } from "../config/prisma.js";

export async function listStudents() {
  return prisma.student.findMany({
    orderBy: { admissionNumber: "asc" },
    include: {
      user: true,
      class: true,
      parent: { include: { user: true } },
    },
  });
}


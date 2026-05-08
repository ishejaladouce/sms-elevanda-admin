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

export async function assignStudentToClass(studentId, classId) {
  return prisma.student.update({
    where: { id: studentId },
    data: { classId: classId || null },
    include: { user: true, class: true, parent: { include: { user: true } } },
  });
}


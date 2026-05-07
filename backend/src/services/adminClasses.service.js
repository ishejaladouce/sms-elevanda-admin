import { prisma } from "../config/prisma.js";

export async function listClasses() {
  return prisma.class.findMany({
    orderBy: { name: "asc" },
    include: { teacher: { include: { user: true } } },
  });
}

export async function createClass({ name, teacherId }) {
  return prisma.class.create({
    data: { name, teacherId: teacherId || null },
    include: { teacher: { include: { user: true } } },
  });
}

export async function updateClass(classId, { name, teacherId }) {
  return prisma.class.update({
    where: { id: classId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(teacherId !== undefined ? { teacherId: teacherId || null } : {}),
    },
    include: { teacher: { include: { user: true } } },
  });
}

export async function deleteClass(classId) {
  await prisma.class.delete({ where: { id: classId } });
  return true;
}

export async function listTeachers() {
  return prisma.teacher.findMany({
    orderBy: { id: "desc" },
    include: { user: true, classes: true },
  });
}


import { prisma } from "../config/prisma.js";

async function assertTeacherOwnsStudent({ teacherUserId, studentId }) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, class: { select: { teacher: { select: { userId: true } } } } },
  });

  const ownerUserId = student?.class?.teacher?.userId;
  if (!student || !ownerUserId || ownerUserId !== teacherUserId) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

export async function listMyClasses(teacherUserId) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUserId },
    include: {
      classes: {
        orderBy: { name: "asc" },
        include: {
          students: {
            orderBy: { admissionNumber: "asc" },
            include: { user: true },
          },
        },
      },
      user: true,
    },
  });

  if (!teacher) {
    const err = new Error("Teacher profile not found");
    err.status = 404;
    throw err;
  }

  return teacher;
}

export async function upsertGrade({ teacherUserId, studentId, subject, term, score }) {
  await assertTeacherOwnsStudent({ teacherUserId, studentId });

  const existing = await prisma.grade.findFirst({
    where: { studentId, subject, term },
    select: { id: true },
  });

  if (existing) {
    return prisma.grade.update({
      where: { id: existing.id },
      data: { score, updatedBy: teacherUserId },
    });
  }

  return prisma.grade.create({
    data: { studentId, subject, term, score, updatedBy: teacherUserId },
  });
}

export async function upsertAttendance({ teacherUserId, studentId, date, status }) {
  await assertTeacherOwnsStudent({ teacherUserId, studentId });

  return prisma.attendance.upsert({
    where: { studentId_date: { studentId, date } },
    update: { status },
    create: { studentId, date, status },
  });
}


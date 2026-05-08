import { prisma } from "../config/prisma.js";

export async function listSchedules(classId) {
  return prisma.schedule.findMany({
    where: { classId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function createSchedule(classId, { subject, dayOfWeek, startTime, endTime }) {
  return prisma.schedule.create({
    data: { classId, subject, dayOfWeek, startTime, endTime },
  });
}

export async function updateSchedule(scheduleId, { subject, dayOfWeek, startTime, endTime }) {
  return prisma.schedule.update({
    where: { id: scheduleId },
    data: {
      ...(subject !== undefined ? { subject } : {}),
      ...(dayOfWeek !== undefined ? { dayOfWeek } : {}),
      ...(startTime !== undefined ? { startTime } : {}),
      ...(endTime !== undefined ? { endTime } : {}),
    },
  });
}

export async function deleteSchedule(scheduleId) {
  await prisma.schedule.delete({ where: { id: scheduleId } });
  return true;
}


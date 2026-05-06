import { prisma } from "../config/prisma.js";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function verifyDevice(userId) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isDeviceVerified: true },
  });
  return user;
}


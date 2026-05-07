import { prisma } from "../config/prisma.js";

export async function listFeePayments() {
  return prisma.feePayment.findMany({
    orderBy: { createdAt: "desc" },
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


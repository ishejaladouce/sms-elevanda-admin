require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: node scripts/check-user.cjs <email>");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const u = await prisma.user.findUnique({ where: { email } });

  console.log({
    id: u?.id,
    name: u?.name,
    email: u?.email,
    role: u?.role,
    deviceId: u?.deviceId,
    isDeviceVerified: u?.isDeviceVerified,
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = process.argv[2];
  const deviceId = process.argv[3];
  if (!email || !deviceId) {
    console.log("Usage: node scripts/set-device.cjs <email> <deviceId>");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const u = await prisma.user.update({
    where: { email },
    data: { deviceId, isDeviceVerified: true },
    select: { email: true, deviceId: true, isDeviceVerified: true },
  });

  console.log(u);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


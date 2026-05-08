require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = (process.argv[2] || "").trim();
  const deviceId = (process.argv[3] || "").trim();
  if (!email || !deviceId) {
    console.log("Usage: node scripts/set-device.cjs <email> <deviceId>");
    console.log("Tip: Copy the Device ID from the admin login page (no extra spaces).");
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


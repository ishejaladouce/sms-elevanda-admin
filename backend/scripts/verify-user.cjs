require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: node scripts/verify-user.cjs <email>");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const u = await prisma.user.update({
    where: { email },
    data: { isDeviceVerified: true },
  });

  console.log({ email: u.email, isDeviceVerified: u.isDeviceVerified });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


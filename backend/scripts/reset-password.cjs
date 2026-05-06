require("dotenv").config();
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const SALT_BYTES = 16;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const hash = crypto
    .createHash("sha512")
    .update(`${salt}:${password}`, "utf8")
    .digest("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];
  if (!email || !newPassword) {
    console.log("Usage: node scripts/reset-password.cjs <email> <newPassword>");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const u = await prisma.user.update({
    where: { email },
    data: { passwordHash: hashPassword(newPassword) },
  });

  console.log({ email: u.email, updated: true });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


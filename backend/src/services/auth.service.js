import { prisma } from "../config/prisma.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";

export async function registerStaff({ name, email, password, role, deviceId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      deviceId,
      isDeviceVerified: false,
    },
  });

  if (role === "TEACHER") {
    await prisma.teacher.create({ data: { userId: user.id } });
  }

  return user;
}

export async function loginStaff({ email, password, deviceId }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const stored = (user.deviceId ?? "").trim();
  const incoming = (deviceId ?? "").trim();
  if (stored !== incoming) {
    const err = new Error(
      "Device mismatch. Use the Device ID from this same browser address, or run set-device in admin/backend."
    );
    err.status = 403;
    // In development, help debug port / copy-paste issues without printing full secrets.
    if (process.env.NODE_ENV === "development") {
      err.data = {
        storedLength: stored.length,
        incomingLength: incoming.length,
        storedStartsWith: stored.slice(0, 6),
        incomingStartsWith: incoming.slice(0, 6),
      };
    }
    throw err;
  }

  if (!user.isDeviceVerified) {
    const err = new Error("Device not verified. Contact admin.");
    err.status = 403;
    throw err;
  }

  return user;
}


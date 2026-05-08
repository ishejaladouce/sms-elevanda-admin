import { prisma } from "../config/prisma.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";

// Local testing only: set RELAX_DEVICE_MATCH=true in backend/.env
// Still requires isDeviceVerified; skips strict deviceId equality and saves the current browser id on login.
function deviceMatchRelaxed() {
  const v = (process.env.RELAX_DEVICE_MATCH ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

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

  if (!user.isDeviceVerified) {
    const err = new Error("Device not verified. Contact admin.");
    err.status = 403;
    throw err;
  }

  const stored = (user.deviceId ?? "").trim();
  const incoming = (deviceId ?? "").trim();
  const relaxed = deviceMatchRelaxed();

  if (stored !== incoming) {
    if (relaxed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { deviceId: incoming },
      });
    } else {
      const err = new Error(
        "Device mismatch. Same browser address (including port) as in the database, or set RELAX_DEVICE_MATCH=true in backend/.env for local testing only."
      );
      err.status = 403;
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
  }

  if (relaxed && stored !== incoming) {
    return prisma.user.findUnique({ where: { id: user.id } });
  }

  return user;
}

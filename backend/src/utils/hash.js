import crypto from "crypto";

const SALT_BYTES = 16;

export function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const hash = crypto
    .createHash("sha512")
    .update(`${salt}:${password}`, "utf8")
    .digest("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, expectedHash] = String(stored).split(":");
  if (!salt || !expectedHash) return false;

  const actualHash = crypto
    .createHash("sha512")
    .update(`${salt}:${password}`, "utf8")
    .digest("hex");

  const a = Buffer.from(actualHash, "hex");
  const b = Buffer.from(expectedHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}


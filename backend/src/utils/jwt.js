import jwt from "jsonwebtoken";

const COOKIE_NAME = "sms_token";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30m",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function shouldRefresh(payload) {
  const refreshEverySec = Number(process.env.JWT_REFRESH_EVERY_SEC || 600);
  const iatSec = typeof payload?.iat === "number" ? payload.iat : 0;
  if (!iatSec) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec - iatSec >= refreshEverySec;
}

export function refreshAuthCookieIfNeeded(res, payload) {
  if (!shouldRefresh(payload)) return false;
  const token = signToken({ sub: payload.sub, role: payload.role, email: payload.email });
  setAuthCookie(res, token);
  return true;
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}


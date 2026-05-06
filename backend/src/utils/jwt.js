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


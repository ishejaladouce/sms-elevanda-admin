import { getAuthCookieName, verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.[getAuthCookieName()];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized", data: null });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized", data: null });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden", data: null });
    }
    next();
  };
}


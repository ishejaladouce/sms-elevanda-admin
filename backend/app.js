import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { apiRateLimiter } from "./src/middlewares/rateLimit.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { swaggerSpec } from "./src/config/swagger.js";

dotenv.config();

export const app = express();

app.use(helmet());
app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = [
        process.env.CLIENT_URL,
        "http://localhost:5174",
        "http://localhost:5175",
      ].filter(Boolean);

      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  return res.json({ success: true, message: "OK", data: null });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Not found", data: null });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  return res.status(status).json({ success: false, message, data: null });
});


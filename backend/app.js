import "./load-env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { apiRateLimiter } from "./src/middlewares/rateLimit.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import { swaggerSpec } from "./src/config/swagger.js";

export const app = express();

app.use(helmet());

const corsOptions = {
  origin: (origin, cb) => {
    const allowed = [
      process.env.CLIENT_URL,
      "http://localhost:5174",
      "http://localhost:5175",
    ].filter(Boolean);

    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  return res.json({ success: true, message: "OK", data: null });
});

// Machine-readable OpenAPI spec (for Postman, codegen, CI checks).
app.get("/api/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.json(swaggerSpec);
});

const swaggerUiOptions = {
  customSiteTitle: "SMS Elevanda – Admin API",
  swaggerOptions: {
    persistAuthorization: false,
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
  },
};

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);

app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Not found", data: null });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  const data = err.data !== undefined ? err.data : null;
  return res.status(status).json({ success: false, message, data });
});


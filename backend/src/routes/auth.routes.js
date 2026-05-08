import express from "express";
import { validateBody } from "../middlewares/validate.middleware.js";
import { login, loginSchema, logout, me, register, registerSchema } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;


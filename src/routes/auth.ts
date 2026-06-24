// src/routes/authRoutes.ts
import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// пример защищённого тестового роута
router.get("/me", authMiddleware, authController.me);

export default router;

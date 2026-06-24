import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Journal API placeholder" });
});

export default router;

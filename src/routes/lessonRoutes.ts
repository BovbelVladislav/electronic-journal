import { Router } from "express";
import { lessonController } from "../controllers/lessonController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/subject/:subjectId", authMiddleware, lessonController.getBySubject);
router.get("/:id", authMiddleware, lessonController.getOne);
router.post("/", authMiddleware, lessonController.create);
router.delete("/:id", authMiddleware, lessonController.delete);

export default router;

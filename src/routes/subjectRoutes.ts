import { Router } from "express";
import { subjectController } from "../controllers/subjectController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = Router();

router.get("/", authMiddleware, subjectController.getMySubjects);
router.get("/:id", authMiddleware, subjectController.getOne);
router.post("/", authMiddleware, subjectController.create);
router.delete("/:id", authMiddleware, subjectController.delete);

export default router;

import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import * as lessonController from '../controllers/lessonController';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['teacher']), lessonController.create);

export default router;

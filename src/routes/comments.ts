import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as commentController from '../controllers/commentController';

const router = Router();

router.post('/', authMiddleware, commentController.addComment);

export default router;

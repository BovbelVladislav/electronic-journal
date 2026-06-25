import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as journalController from '../controllers/journalController';

const router = Router();

router.get('/', authMiddleware, journalController.getJournal);

export default router;

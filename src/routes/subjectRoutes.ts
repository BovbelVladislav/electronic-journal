import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import * as subjectController from '../controllers/subjectController';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['teacher']), subjectController.createSubject);
router.get('/', authMiddleware, subjectController.listSubjects);

export default router;

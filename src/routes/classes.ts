import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import * as classController from '../controllers/classController';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['teacher']), classController.createClass);
router.get('/teacher', authMiddleware, roleMiddleware(['teacher']), classController.getTeacherClasses);
router.get('/student', authMiddleware, roleMiddleware(['student']), classController.getStudentClasses);
router.delete('/:classId', authMiddleware, roleMiddleware(['teacher']), classController.deleteClass);

export default router;

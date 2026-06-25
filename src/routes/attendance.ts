import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import * as attendanceController from '../controllers/attendanceController';

const router = Router();

// roleMiddleware принимает массив ролей
router.post('/attendance', authMiddleware, roleMiddleware(['teacher']), attendanceController.markAttendance);
router.post('/grade', authMiddleware, roleMiddleware(['teacher']), attendanceController.addGrade);
router.get('/class/:classId/:date', authMiddleware, roleMiddleware(['teacher']), attendanceController.getClassAttendance);

export default router;

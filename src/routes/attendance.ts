import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/attendance', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  attendanceController.recordAttendance(req, res)
);
router.post('/grade', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  attendanceController.setGrade(req, res)
);
router.get('/student/:studentId', authMiddleware, (req, res) =>
  attendanceController.getStudentGrades(req, res)
);
router.get('/class/:classId/:date', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  attendanceController.getClassAttendance(req, res)
);

export default router;

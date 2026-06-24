import { Router } from 'express';
import { classController } from '../controllers/classController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  classController.createClass(req, res)
);

router.get('/teacher', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  classController.getTeacherClasses(req, res)
);

router.get('/student', authMiddleware, roleMiddleware('student'), (req, res) =>
  classController.getStudentClasses(req, res)
);

router.get('/group/:groupId', authMiddleware, (req, res) =>
  classController.getGroupClasses(req, res)
);

router.delete('/:classId', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  classController.deleteClass(req, res)
);

export default router;

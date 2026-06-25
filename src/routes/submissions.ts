import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';
import { createSubmission, getSubmission } from '../controllers/submissionController';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Создать submission (файл опционально)
router.post('/', authMiddleware, roleMiddleware(['student']), upload.single('file'), createSubmission);
router.get('/:id', authMiddleware, getSubmission);

// Пример: выставление оценки (только для teacher)
router.patch('/:submissionId/grade', authMiddleware, roleMiddleware(['teacher']), async (req, res) => {
  // реализация выставления оценки в отдельном контроллере/сервисе
  res.status(501).json({ message: 'Not implemented' });
});

export default router;

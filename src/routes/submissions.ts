import { Router } from 'express';
import { submissionController } from '../controllers/submissionController';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.ts';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800') },
});

const router = Router();

router.post('/', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  submissionController.createAssignment(req, res)
);

router.post('/:assignmentId/submit', authMiddleware, upload.single('file'), (req, res) =>
  submissionController.submitAssignment(req, res)
);

router.patch('/:submissionId/grade', authMiddleware, roleMiddleware('teacher'), (req, res) =>
  submissionController.gradeSubmission(req, res)
);

router.get('/:assignmentId/submissions', authMiddleware, (req, res) =>
  submissionController.getAssignmentSubmissions(req, res)
);

router.get('/my-submissions', authMiddleware, (req, res) =>
  submissionController.getStudentSubmissions(req, res)
);

router.get('/subject/:subjectId', authMiddleware, (req, res) =>
  submissionController.getSubjectAssignments(req, res)
);

export default router;

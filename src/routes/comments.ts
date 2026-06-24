import { Router } from 'express';
import { commentController } from '../controllers/commentController';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', authMiddleware, (req, res) =>
  commentController.addComment(req, res)
);

router.get('/:submissionId', authMiddleware, (req, res) =>
  commentController.getSubmissionComments(req, res)
);

router.delete('/:commentId', authMiddleware, (req, res) =>
  commentController.deleteComment(req, res)
);

router.patch('/:commentId', authMiddleware, (req, res) =>
  commentController.updateComment(req, res)
);

export default router;

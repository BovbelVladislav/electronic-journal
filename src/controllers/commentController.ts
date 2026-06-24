import { Request, Response } from 'express';
import { commentService } from '../services/commentService';

export class CommentController {
  async addComment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No user' });
      }

      const { submissionId, content } = req.body;
      const comment = await commentService.addComment(submissionId, req.user.id, content);

      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSubmissionComments(req: Request, res: Response) {
    try {
      const { submissionId } = req.params;
      const comments = await commentService.getSubmissionComments(parseInt(submissionId));
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const success = await commentService.deleteComment(parseInt(commentId));

      if (success) {
        res.json({ message: 'Comment deleted' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const comment = await commentService.updateComment(parseInt(commentId), content);

      res.json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const commentController = new CommentController();

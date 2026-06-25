import { Request, Response } from 'express';
import * as commentService from '../services/commentService';

export const addComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const submissionId = Number(req.body.submissionId);
    const content = req.body.content;
    if (!submissionId || !content) return res.status(400).json({ message: 'submissionId and content required' });

    const comment = await commentService.addComment(submissionId, Number(req.user.id), content);
    return res.status(201).json(comment);
  } catch (err) {
    console.error('addComment error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

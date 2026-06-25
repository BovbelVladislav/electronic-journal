import { Request, Response } from 'express';
import * as subjectService from '../services/subjectService';

export const createSubject = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const subject = await subjectService.createSubject({ name, description, teacherId: Number(req.user.id) });
    return res.status(201).json(subject);
  } catch (err) {
    console.error('createSubject error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const listSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.listSubjects();
    return res.json(subjects);
  } catch (err) {
    console.error('listSubjects error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

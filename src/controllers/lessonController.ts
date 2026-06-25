import { Request, Response } from 'express';
import { createLesson } from '../services/lessonService';

export const create = async (req: Request, res: Response) => {
  try {
    const payload = {
      subjectId: Number(req.body.subjectId),
      groupId: Number(req.body.groupId),
      teacherId: Number(req.body.teacherId),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      dayOfWeek: req.body.dayOfWeek ? Number(req.body.dayOfWeek) : undefined,
      room: req.body.room
    };
    const lesson = await createLesson(payload);
    return res.status(201).json(lesson);
  } catch (err) {
    console.error('lesson create error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

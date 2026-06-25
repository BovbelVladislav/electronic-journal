import { Request, Response } from 'express';
import * as classService from '../services/lessonService';

export const createClass = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const payload = {
      subjectId: Number(req.body.subjectId),
      groupId: Number(req.body.groupId),
      teacherId: Number(req.body.teacherId),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      dayOfWeek: req.body.dayOfWeek ? Number(req.body.dayOfWeek) : undefined,
      room: req.body.room
    };

    const lesson = await classService.createLesson(payload);
    return res.status(201).json(lesson);
  } catch (err) {
    console.error('createClass error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeacherClasses = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const classes = await classService.getTeacherClasses(Number(req.user.id));
    return res.json(classes);
  } catch (err) {
    console.error('getTeacherClasses error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentClasses = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const classes = await classService.getStudentClasses(Number(req.user.id));
    return res.json(classes);
  } catch (err) {
    console.error('getStudentClasses error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = Number(req.params.classId);
    await classService.deleteLesson(classId);
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteClass error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

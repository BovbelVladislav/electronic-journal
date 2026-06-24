import { Request, Response } from 'express';
import { classService } from '../services/classService';

export class ClassController {
  async createClass(req: Request, res: Response) {
    try {
      const { subjectId, groupId, teacherId, startTime, endTime, dayOfWeek, room } = req.body;

      const classItem = await classService.createClass(
        subjectId,
        groupId,
        teacherId,
        startTime,
        endTime,
        dayOfWeek,
        room
      );

      res.status(201).json(classItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTeacherClasses(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No user' });
      }

      const classes = await classService.getTeacherClasses(req.user.id);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStudentClasses(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No user' });
      }

      const classes = await classService.getStudentClasses(req.user.id);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getGroupClasses(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const classes = await classService.getGroupClasses(parseInt(groupId));
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteClass(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const success = await classService.deleteClass(parseInt(classId));

      if (success) {
        res.json({ message: 'Class deleted' });
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const classController = new ClassController();

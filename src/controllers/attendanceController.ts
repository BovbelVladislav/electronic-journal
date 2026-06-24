import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService';
import { AttendanceStatus } from '../types';

export class AttendanceController {
  async recordAttendance(req: Request, res: Response) {
    try {
      const { classId, studentId, date, status, comments } = req.body;

      const attendance = await attendanceService.recordAttendance(
        classId,
        studentId,
        new Date(date),
        status as AttendanceStatus,
        comments
      );

      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async setGrade(req: Request, res: Response) {
    try {
      const { classId, studentId, date, grade, comments } = req.body;

      const attendance = await attendanceService.setGrade(
        classId,
        studentId,
        new Date(date),
        grade,
        comments
      );

      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStudentGrades(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { subjectId } = req.query;

      const grades = await attendanceService.getStudentGrades(
        parseInt(studentId),
        subjectId ? parseInt(subjectId as string) : undefined
      );

      res.json(grades);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClassAttendance(req: Request, res: Response) {
    try {
      const { classId, date } = req.params;

      const attendance = await attendanceService.getClassAttendance(
        parseInt(classId),
        new Date(date)
      );

      res.json(attendance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const attendanceController = new AttendanceController();

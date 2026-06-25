import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { AttendanceGrade } from '../entities/AttendanceGrade';
import { Lesson } from '../entities/Lesson';
import { User } from '../entities/User';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { classId, studentId, date, attendance } = req.body;
    if (!classId || !studentId || !date || !attendance) return res.status(400).json({ message: 'Missing fields' });

    const lessonRepo = AppDataSource.getRepository(Lesson);
    const lesson = await lessonRepo.findOneBy({ id: Number(classId) });
    if (!lesson) return res.status(404).json({ message: 'Class not found' });

    const userRepo = AppDataSource.getRepository(User);
    const student = await userRepo.findOneBy({ id: Number(studentId) });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const repo = AppDataSource.getRepository(AttendanceGrade);
    const existing = await repo.findOneBy({ classId: Number(classId), student: { id: student.id } as any, date });
    if (existing) {
      existing.attendance = attendance;
      await repo.save(existing);
      return res.json(existing);
    }

    const ag = repo.create({
      classId: Number(classId),
      lesson,
      student,
      date,
      attendance
    });

    await repo.save(ag);
    return res.status(201).json(ag);
  } catch (err) {
    console.error('markAttendance error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addGrade = async (req: Request, res: Response) => {
  try {
    const { classId, studentId, date, grade } = req.body;
    if (!classId || !studentId || !date || grade === undefined) return res.status(400).json({ message: 'Missing fields' });

    const repo = AppDataSource.getRepository(AttendanceGrade);
    const existing = await repo.findOneBy({ classId: Number(classId), student: { id: Number(studentId) } as any, date });
    if (!existing) return res.status(404).json({ message: 'Attendance record not found' });

    existing.grade = Number(grade);
    await repo.save(existing);
    return res.json(existing);
  } catch (err) {
    console.error('addGrade error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClassAttendance = async (req: Request, res: Response) => {
  try {
    const classId = Number(req.params.classId);
    const date = req.params.date;
    const repo = AppDataSource.getRepository(AttendanceGrade);
    const rows = await repo.find({
      where: { classId, date },
      relations: ['student']
    });
    return res.json(rows);
  } catch (err) {
    console.error('getClassAttendance error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

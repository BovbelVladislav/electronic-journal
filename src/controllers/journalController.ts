import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { AttendanceGrade } from '../entities/AttendanceGrade';

export const getJournal = async (req: Request, res: Response) => {
  try {
    // Простой пример: вернуть последние записи посещаемости
    const repo = AppDataSource.getRepository(AttendanceGrade);
    const rows = await repo.find({ relations: ['student', 'lesson'], take: 100, order: { date: 'DESC' } });
    return res.json(rows);
  } catch (err) {
    console.error('getJournal error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Submission } from '../entities/Submission';
import { Assignment } from '../entities/Assignment';
import { User } from '../entities/User';
import { LabWork } from '../entities/LabWork';

// Если используете multer, типы доступны через Express.Multer.File
// В этом контроллере предполагается, что middleware multer уже применён в роуте.

export const createSubmission = async (req: Request, res: Response) => {
  const submissionRepo = AppDataSource.getRepository(Submission);
  const assignmentRepo = AppDataSource.getRepository(Assignment);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const { assignmentId, content, labWorkId } = req.body;
    const assignment = await assignmentRepo.findOneBy({ id: Number(assignmentId) });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Пример: userId берём из req.user (предполагается auth middleware)
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const student = await userRepo.findOneBy({ id: Number(userId) });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let filePath: string | undefined;
    if ((req as any).file) {
      const file = (req.file as Express.Multer.File);
      filePath = file.path;
    }

    const submission = submissionRepo.create({
      assignment,
      student,
      content: content ?? null,
      filePath: filePath ?? null,
      submittedAt: new Date(),
      status: 'submitted',
      // если есть связь с labWork
      labWork: labWorkId ? (await AppDataSource.getRepository(LabWork).findOneBy({ id: Number(labWorkId) })) : undefined
    });

    await submissionRepo.save(submission);
    return res.status(201).json(submission);
  } catch (err) {
    console.error('createSubmission error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  const submissionRepo = AppDataSource.getRepository(Submission);
  try {
    const id = Number(req.params.id);
    const submission = await submissionRepo.findOne({
      where: { id },
      relations: ['assignment', 'student', 'labWork']
    });
    if (!submission) return res.status(404).json({ message: 'Not found' });
    return res.json(submission);
  } catch (err) {
    console.error('getSubmission error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

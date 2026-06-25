import { AppDataSource } from '../database/data-source';
import { Subject } from '../entities/Subject';
import { User } from '../entities/User';

export const createSubject = async (payload: { name: string; description?: string; teacherId: number }) => {
  const repo = AppDataSource.getRepository(Subject);
  const userRepo = AppDataSource.getRepository(User);

  const teacher = await userRepo.findOneBy({ id: payload.teacherId });
  if (!teacher) throw new Error('Teacher not found');

  const subject = repo.create({
    name: payload.name,
    description: payload.description ?? null,
    teacher
  });

  return repo.save(subject);
};

export const listSubjects = async () => {
  const repo = AppDataSource.getRepository(Subject);
  return repo.find({ relations: ['teacher'] });
};

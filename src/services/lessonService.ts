import { AppDataSource } from '../database/data-source';
import { Lesson } from '../entities/Lesson';
import { Subject } from '../entities/Subject';
import { Group } from '../entities/Group';
import { User } from '../entities/User';

export const createLesson = async (payload: {
  subjectId: number;
  groupId: number;
  teacherId: number;
  startTime?: string;
  endTime?: string;
  dayOfWeek?: number;
  room?: string;
}) => {
  const repo = AppDataSource.getRepository(Lesson);
  const subjectRepo = AppDataSource.getRepository(Subject);

  const subject = await subjectRepo.findOneBy({ id: payload.subjectId });
  if (!subject) throw new Error('Subject not found');

  const lesson = repo.create({
    subject,
    group: { id: payload.groupId } as Group,
    teacher: { id: payload.teacherId } as User,
    startTime: payload.startTime,
    endTime: payload.endTime,
    dayOfWeek: payload.dayOfWeek,
    room: payload.room
  });

  return repo.save(lesson);
};

export const getTeacherClasses = async (teacherId: number) => {
  const repo = AppDataSource.getRepository(Lesson);
  return repo.find({
    where: { teacher: { id: teacherId } as any },
    relations: ['subject', 'group']
  });
};

export const getStudentClasses = async (studentId: number) => {
  // Предполагаем, что у студента есть группа; ищем по student->group relation
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: studentId },
    relations: ['group']
  });
  if (!user || !user.group) return [];
  const repo = AppDataSource.getRepository(Lesson);
  return repo.find({
    where: { group: { id: user.group.id } as any },
    relations: ['subject', 'teacher']
  });
};

export const deleteLesson = async (lessonId: number) => {
  const repo = AppDataSource.getRepository(Lesson);
  const l = await repo.findOneBy({ id: lessonId });
  if (!l) throw new Error('Lesson not found');
  await repo.remove(l);
  return true;
};

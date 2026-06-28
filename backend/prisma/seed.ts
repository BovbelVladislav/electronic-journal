import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.file.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.labSubmission.deleteMany();
  await prisma.team.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const pwd = await bcrypt.hash('password123', 10);

  const teacher = await prisma.user.create({
    data: { email: 'teacher@college.ru', name: 'Иванов И.И.', role: 'TEACHER', password: pwd },
  });
  const admin = await prisma.user.create({
    data: { email: 'admin@college.ru', name: 'Администратор', role: 'ADMIN', password: pwd },
  });
  const students = await Promise.all([
    prisma.user.create({ data: { email: 'student1@college.ru', name: 'Петров П.П.', role: 'STUDENT', password: pwd } }),
    prisma.user.create({ data: { email: 'student2@college.ru', name: 'Сидоров С.С.', role: 'STUDENT', password: pwd } }),
    prisma.user.create({ data: { email: 'student3@college.ru', name: 'Козлова А.А.', role: 'STUDENT', password: pwd } }),
  ]);

  const subjects = await Promise.all([
    prisma.subject.create({ data: { title: 'Компьютерные сети', code: 'CSNET', teacherId: teacher.id } }),
    prisma.subject.create({ data: { title: 'Проектирование ПО', code: 'PPO', teacherId: teacher.id } }),
    prisma.subject.create({ data: { title: 'Базы данных', code: 'DB', teacherId: teacher.id } }),
  ]);

  const now = new Date();
  const mkDate = (days: number, h: number, m: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d;
  };

  for (let i = 0; i < 5; i++) {
    const date = mkDate(i, 0, 0);
    await prisma.lesson.create({
      data: {
        subjectId: subjects[i % 3].id,
        date,
        startTime: mkDate(i, 9, 0),
        endTime: mkDate(i, 10, 30),
        type: i % 2 === 0 ? 'LECTURE' : 'LAB',
      },
    });
  }

  const lessons = await prisma.lesson.findMany();
  for (const lesson of lessons.slice(0, 3)) {
    for (const s of students) {
      await prisma.attendance.create({
        data: { lessonId: lesson.id, studentId: s.id, status: Math.random() > 0.2 ? 'PRESENT' : 'ABSENT' },
      });
    }
  }

  const lab = await prisma.lab.create({
    data: {
      subjectId: subjects[0].id,
      title: 'Лабораторная №1: REST API',
      description: 'Разработать REST API для электронного журнала',
      deadline: mkDate(14, 23, 59),
    },
  });

  const submission = await prisma.labSubmission.create({
    data: { labId: lab.id, studentId: students[0].id },
  });

  await prisma.grade.create({
    data: { studentId: students[0].id, subjectId: subjects[0].id, value: 8, type: 'LAB', submissionId: submission.id, comment: 'Хорошая работа' },
  });

  await prisma.grade.createMany({
    data: [
      { studentId: students[0].id, subjectId: subjects[1].id, value: 9, type: 'TEST' },
      { studentId: students[1].id, subjectId: subjects[0].id, value: 7, type: 'PRACTICAL' },
      { studentId: students[2].id, subjectId: subjects[2].id, value: 10, type: 'ORAL' },
    ],
  });

  console.log('Seed OK. Login: teacher@college.ru / student1@college.ru, password: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

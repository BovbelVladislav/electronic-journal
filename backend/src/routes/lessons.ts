import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/subject/:subjectId', auth, async (req, res) => {
  const lessons = await prisma.lesson.findMany({
    where: { subjectId: Number(req.params.subjectId) },
    include: { subject: { select: { title: true, code: true } }, attendances: true },
    orderBy: { date: 'asc' },
  });
  res.json(lessons);
});

router.get('/schedule', auth, async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date();
  const to = req.query.to ? new Date(String(req.query.to)) : new Date(from.getTime() + 7 * 86400000);
  const lessons = await prisma.lesson.findMany({
    where: { date: { gte: from, lte: to } },
    include: { subject: { select: { id: true, title: true, code: true } } },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
  res.json(lessons);
});

router.post('/', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { subjectId, date, startTime, endTime, type } = req.body;
  if (!subjectId || !date || !startTime || !endTime || !type) {
    return res.status(400).json({ message: 'subjectId, date, startTime, endTime, type required' });
  }
  const lesson = await prisma.lesson.create({
    data: {
      subjectId: Number(subjectId),
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      type,
    },
    include: { subject: { select: { title: true } } },
  });
  res.status(201).json(lesson);
});

router.delete('/:id', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  await prisma.lesson.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { auth, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/student/:studentId', auth, async (req, res) => {
  const grades = await prisma.grade.findMany({
    where: { studentId: Number(req.params.studentId) },
    include: { subject: { select: { title: true, code: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(grades);
});

router.get('/subject/:subjectId', auth, async (req, res) => {
  const grades = await prisma.grade.findMany({
    where: { subjectId: Number(req.params.subjectId) },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(grades);
});

router.get('/my', auth, async (req: AuthRequest, res) => {
  const grades = await prisma.grade.findMany({
    where: { studentId: req.user!.id },
    include: { subject: { select: { title: true, code: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(grades);
});

router.post('/', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { studentId, subjectId, value, type, comment, submissionId } = req.body;
  if (!studentId || !subjectId || value == null || !type) {
    return res.status(400).json({ message: 'studentId, subjectId, value, type required' });
  }
  const grade = await prisma.grade.create({
    data: { studentId, subjectId, value: Number(value), type, comment, submissionId },
    include: { student: { select: { name: true } }, subject: { select: { title: true } } },
  });
  res.status(201).json(grade);
});

router.delete('/:id', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  await prisma.grade.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;

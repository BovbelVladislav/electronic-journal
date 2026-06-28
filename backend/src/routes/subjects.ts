import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { auth, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (_req, res) => {
  const subjects = await prisma.subject.findMany({
    include: { teacher: { select: { id: true, name: true, email: true } }, _count: { select: { lessons: true, labs: true } } },
  });
  res.json(subjects);
});

router.get('/:id', auth, async (req, res) => {
  const subject = await prisma.subject.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      lessons: { orderBy: { date: 'asc' } },
      labs: { orderBy: { issuedAt: 'desc' } },
    },
  });
  if (!subject) return res.status(404).json({ message: 'Not found' });
  res.json(subject);
});

router.post('/', auth, requireRole('TEACHER', 'ADMIN'), async (req: AuthRequest, res) => {
  const { title, code } = req.body;
  if (!title || !code) return res.status(400).json({ message: 'title, code required' });
  const subject = await prisma.subject.create({
    data: { title, code, teacherId: req.user!.role === 'TEACHER' ? req.user!.id : req.body.teacherId },
    include: { teacher: { select: { id: true, name: true } } },
  });
  res.status(201).json(subject);
});

router.put('/:id', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { title, code } = req.body;
  const subject = await prisma.subject.update({
    where: { id: Number(req.params.id) },
    data: { ...(title && { title }), ...(code && { code }) },
  });
  res.json(subject);
});

router.delete('/:id', auth, requireRole('ADMIN'), async (req, res) => {
  await prisma.subject.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;

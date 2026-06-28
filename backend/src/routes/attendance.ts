import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { auth, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/student/:studentId', auth, async (req, res) => {
  const records = await prisma.attendance.findMany({
    where: { studentId: Number(req.params.studentId) },
    include: { lesson: { include: { subject: { select: { title: true, code: true } } } } },
    orderBy: { lesson: { date: 'desc' } },
  });
  res.json(records);
});

router.get('/lesson/:lessonId', auth, async (req, res) => {
  const records = await prisma.attendance.findMany({
    where: { lessonId: Number(req.params.lessonId) },
    include: { student: { select: { id: true, name: true, email: true } } },
  });
  res.json(records);
});

router.post('/', auth, requireRole('TEACHER', 'ADMIN'), async (req, res) => {
  const { lessonId, records } = req.body as { lessonId: number; records: { studentId: number; status: string; late?: boolean; note?: string }[] };
  if (!lessonId || !records?.length) return res.status(400).json({ message: 'lessonId and records required' });

  const results = await Promise.all(
    records.map((r) =>
      prisma.attendance.upsert({
        where: { lessonId_studentId: { lessonId, studentId: r.studentId } },
        create: { lessonId, studentId: r.studentId, status: r.status as 'PRESENT' | 'ABSENT' | 'EXCUSED', late: r.late ?? false, note: r.note },
        update: { status: r.status as 'PRESENT' | 'ABSENT' | 'EXCUSED', late: r.late ?? false, note: r.note },
      })
    )
  );
  res.json(results);
});

router.get('/my', auth, async (req: AuthRequest, res) => {
  const records = await prisma.attendance.findMany({
    where: { studentId: req.user!.id },
    include: { lesson: { include: { subject: { select: { title: true, code: true } } } } },
    orderBy: { lesson: { date: 'desc' } },
  });
  res.json(records);
});

export default router;

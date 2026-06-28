import { Router } from 'express';
import { prisma, omitPassword } from '../lib/prisma';
import { auth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', auth, requireRole('TEACHER', 'ADMIN'), async (_req, res) => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { name: 'asc' },
  });
  res.json(students);
});

export default router;

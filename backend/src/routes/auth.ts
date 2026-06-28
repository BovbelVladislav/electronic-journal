import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma, omitPassword } from '../lib/prisma';
import { auth, AuthRequest, signToken } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'email, password, name required' });
  }
  const userRole = (role || 'STUDENT').toUpperCase();
  if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(userRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hash, role: userRole as 'STUDENT' | 'TEACHER' | 'ADMIN' },
  });
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.json({ token, user: omitPassword(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email, password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.json({ token, user: omitPassword(user) });
});

router.get('/profile', auth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(omitPassword(user));
});

export default router;

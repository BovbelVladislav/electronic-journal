import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';
import { createTokenForUser, hashPassword, verifyPassword } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await userRepo.findOneBy({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const passwordHash = await hashPassword(password);
    const user = userRepo.create({
      email,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      role: role || 'student'
    });
    await userRepo.save(user);
    const token = createTokenForUser(user);
    return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createTokenForUser(user);
    return res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response) => {
  // req.user расширён в src/types/express.d.ts
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  return res.json({ id: user.id, role: user.role });
};

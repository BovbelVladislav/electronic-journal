// src/services/authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

export const createTokenForUser = (user: User): string => {
  const payload = { userId: user.id, role: user.role };
  // Приводим sign к any, чтобы избежать проблем с типами @types/jsonwebtoken
  const signAny: any = jwt.sign;
  const token = signAny(payload, JWT_SECRET as any, { expiresIn: JWT_EXPIRES as any });
  return token as string;
};

export const verifyPassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, 10);
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export interface AuthRequest extends Request {
  user?: Partial<User> & { id?: number; role?: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.userId) return res.status(401).json({ message: 'Invalid token' });

    // можно подгрузить пользователя из БД при необходимости
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: Number(payload.userId) });
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ message: 'Forbidden' });
    if (!allowedRoles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};

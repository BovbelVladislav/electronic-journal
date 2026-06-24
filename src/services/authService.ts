import pool from '../database/pool';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, JWTPayload } from '../types';

export class AuthService {
  async register(email: string, password: string, firstName: string, lastName: string, role: string = 'student'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, role, created_at, updated_at`,
      [email, hashedPassword, firstName, lastName, role]
    );

    return result.rows[0];
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role } as JWTPayload,
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    delete user.password_hash;
    return { user, token };
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}

export const authService = new AuthService();

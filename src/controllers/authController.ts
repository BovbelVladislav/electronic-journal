// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const userRepo = AppDataSource.getRepository(User);
      const existing = await userRepo.findOneBy({ email });
      if (existing) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      // Сохраняем хэш в обоих полях на случай, если в сущности/БД используется password или passwordHash
      const user = userRepo.create({
        email,
        password: hashed,
        passwordHash: hashed
      } as Partial<User>);

      await userRepo.save(user);

      // не возвращаем пароль/хэш
      const { password: _p, passwordHash: _ph, ...safe } = user as any;
      return res.status(201).json(safe);
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Поддерживаем оба варианта хранения хэша
      const hashedFromDb = (user as any).passwordHash ?? (user as any).password;
      if (!hashedFromDb) {
        return res.status(500).json({ message: "User has no password hash" });
      }

      const ok = await bcrypt.compare(password, hashedFromDb);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const { password: _p, passwordHash: _ph, ...safe } = user as any;
      return res.json(safe);
    } catch (err) {
      console.error("Me error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

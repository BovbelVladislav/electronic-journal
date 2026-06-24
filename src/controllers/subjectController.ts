// src/controllers/subjectController.ts
import { Request, Response } from "express";
import { subjectService } from "../services/subjectService";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";

export const subjectController = {
  async getMySubjects(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacherId = user.id;
    const subjects = await subjectService.getByTeacher(teacherId);
    return res.json(subjects);
  },

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const subject = await subjectService.getById(id);
    return res.json(subject);
  },

  async create(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;
    const teacher = await AppDataSource.getRepository(User).findOneBy({
      id: user.id
    });

    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    const subject = await subjectService.create(name, teacher);
    return res.status(201).json(subject);
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await subjectService.delete(id);
    return res.json({ success: true });
  }
};

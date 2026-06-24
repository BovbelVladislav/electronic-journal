import { Request, Response } from "express";
import { lessonService } from "../services/lessonService";

import { AppDataSource } from "../database/data-source";
import { Subject } from "../entities/Subject";

export const lessonController = {
  async getBySubject(req: Request, res: Response) {
    const subjectId = Number(req.params.subjectId);
    const lessons = await lessonService.getBySubject(subjectId);
    res.json(lessons);
  },

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const lesson = await lessonService.getById(id);
    res.json(lesson);
  },

  async create(req: Request, res: Response) {
    const { date, subjectId } = req.body;

    const subject = await AppDataSource.getRepository(Subject).findOneBy({
      id: subjectId
    });

    const lesson = await lessonService.create(date, subject!);
    res.json(lesson);
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await lessonService.delete(id);
    res.json({ success: true });
  }
};

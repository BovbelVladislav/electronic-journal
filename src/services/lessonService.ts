
import { AppDataSource } from "../database/data-source";
import { Lesson } from "../entities/Lesson";
import { Subject } from "../entities/Subject";

export const lessonService = {
  async getBySubject(subjectId: number) {
    return AppDataSource.getRepository(Lesson).find({
      where: { subject: { id: subjectId } },
      relations: ["subject"]
    });
  },

  async getById(id: number) {
    return AppDataSource.getRepository(Lesson).findOne({
      where: { id },
      relations: ["subject"]
    });
  },

  async create(date: string, subject: Subject) {
    const repo = AppDataSource.getRepository(Lesson);
    const lesson = repo.create({ date, subject });
    return repo.save(lesson);
  },

  async delete(id: number) {
    return AppDataSource.getRepository(Lesson).delete(id);
  }
};

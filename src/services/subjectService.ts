
import { AppDataSource } from "../database/data-source";
import { Subject } from "../entities/Subject";
import { User } from "../entities/User";

export const subjectService = {
  async getByTeacher(teacherId: number) {
    return AppDataSource.getRepository(Subject).find({
      where: { teacher: { id: teacherId } },
      relations: ["teacher"]
    });
  },

  async getById(id: number) {
    return AppDataSource.getRepository(Subject).findOne({
      where: { id },
      relations: ["teacher"]
    });
  },

  async create(name: string, teacher: User) {
    const repo = AppDataSource.getRepository(Subject);
    const subject = repo.create({ name, teacher });
    return repo.save(subject);
  },

  async delete(id: number) {
    return AppDataSource.getRepository(Subject).delete(id);
  }
};

// backend/src/database/data-source.ts
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Group } from "../entities/Group";
import { Subject } from "../entities/Subject";
import { Lesson } from "../entities/Lesson";
import { Grade } from "../entities/Grade";
import { LabWork } from "../entities/LabWork";
import { Submission } from "../entities/Submission";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Group,
    Subject,
    Lesson,
    Grade,
    LabWork,
    Submission
  ],
});

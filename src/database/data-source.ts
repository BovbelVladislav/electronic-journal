import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Subject } from '../entities/Subject';
import { Lesson } from '../entities/Lesson';
import { AttendanceGrade } from '../entities/AttendanceGrade';
import { Assignment } from '../entities/Assignment';
import { Submission } from '../entities/Submission';
import { Comment } from '../entities/Comment';
import { TeamMember } from '../entities/TeamMember';
import { Notification } from '../entities/Notification';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'db.sqlite');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: DB_PATH,
  synchronize: true, // для разработки: автоматически создаёт таблицы по entity
  logging: false,
  entities: [
    User,
    Group,
    Subject,
    Lesson,
    AttendanceGrade,
    Assignment,
    Submission,
    Comment,
    TeamMember,
    Notification
  ],
  migrations: [],
  subscribers: []
});

export default AppDataSource;

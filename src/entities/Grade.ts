import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Lesson } from "./Lesson";
import { User } from "./User";

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: number; // 1–5 или 0–100 — потом решим

  @ManyToOne(() => Lesson, lesson => lesson.grades, { nullable: false })
  lesson!: Lesson;

  @ManyToOne(() => User, user => user.grades, { nullable: false })
  student!: User;
}

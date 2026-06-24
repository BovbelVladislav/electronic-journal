import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Lesson } from "./Lesson";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, user => user.subjects, { nullable: false })
  teacher!: User;

  @OneToMany(() => Lesson, lesson => lesson.subject)
  lessons!: Lesson[];
}

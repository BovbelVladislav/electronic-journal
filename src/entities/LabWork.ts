import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Lesson } from "./Lesson";
import { Submission } from "./Submission";



@Entity()
export class LabWork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  deadline?: string;

  @ManyToOne(() => Lesson, lesson => lesson.labWorks, { nullable: false })
  lesson!: Lesson;

  @OneToMany(() => Submission, submission => submission.labWork)
  submissions!: Submission[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Lesson } from './Lesson';
import { Submission } from './Submission';
import { Assignment } from './Assignment';

@Entity({ name: 'lab_works' })
export class LabWork {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lesson, lesson => lesson.labWorks, { nullable: false })
  lesson!: Lesson;

  @ManyToOne(() => Assignment, assignment => assignment.id, { nullable: true })
  assignment?: Assignment;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Submission, submission => submission.labWork)
  submissions!: Submission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

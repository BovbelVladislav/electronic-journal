import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { Lesson } from './Lesson';
import { User } from './User';

@Entity({ name: 'grades' })
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lesson, lesson => lesson.grades, { nullable: false })
  lesson!: Lesson;

  @ManyToOne(() => User, user => user.grades, { nullable: false })
  student!: User;

  @Column({ type: 'int' })
  value!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

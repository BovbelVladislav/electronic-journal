import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'classes' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject_id!: number;

  @Column()
  group_id!: number;

  @Column()
  teacher_id!: number;

  @Column({ type: 'time' })
  start_time!: string;

  @Column({ type: 'time' })
  end_time!: string;

  @Column()
  day_of_week!: number;

  @Column({ nullable: true })
  room?: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
export default Lesson;

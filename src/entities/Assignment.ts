import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'assignments' })
export class Assignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject_id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text' })
  type!: 'lab' | 'practice' | 'test' | 'control' | 'other';

  @Column({ type: 'datetime', nullable: true })
  deadline?: Date;

  @Column({ default: false })
  is_team_work!: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
export default Assignment;

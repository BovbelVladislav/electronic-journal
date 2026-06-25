import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'attendance_grades' })
export class AttendanceGrade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  class_id!: number;

  @Column()
  student_id!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'text', nullable: true })
  attendance?: 'present' | 'absent' | 'late';

  @Column({ type: 'integer', nullable: true })
  grade?: number;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
export default AttendanceGrade;

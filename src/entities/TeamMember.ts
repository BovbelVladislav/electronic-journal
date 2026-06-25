import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'team_members' })
export class TeamMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  assignment_id!: number;

  @Column()
  student_id!: number;

  @Column({ nullable: true })
  submission_id?: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
export default TeamMember;

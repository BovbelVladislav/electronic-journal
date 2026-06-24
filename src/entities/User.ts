import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { OneToMany } from "typeorm";
import { Subject } from "./Subject";
import { Grade } from "./Grade";
import { Submission } from "./Submission";

export type Role = "student" | "teacher";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: "varchar", default: "student" })
  role!: Role;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @ManyToOne(() => Group, group => group.students, { nullable: true })
  group?: Group;

  @OneToMany(() => Subject, subject => subject.teacher)
subjects!: Subject[];
@OneToMany(() => Grade, grade => grade.student)
grades!: Grade[];
@OneToMany(() => Submission, submission => submission.student)
submissions!: Submission[];

}

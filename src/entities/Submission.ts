import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { LabWork } from "./LabWork";

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileUrl!: string;

  @Column({ default: "pending" })
  status!: "pending" | "accepted" | "rejected";

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => User, user => user.submissions, { nullable: false })
  student!: User;

  @ManyToOne(() => LabWork, lab => lab.submissions, { nullable: false })
  labWork!: LabWork;
}

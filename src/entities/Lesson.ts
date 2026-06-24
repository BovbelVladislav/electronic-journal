import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subject } from "./Subject";
import { OneToMany } from "typeorm";
import { Grade } from "./Grade";
import { LabWork } from "./LabWork";


@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: string;

  @ManyToOne(() => Subject, subject => subject.lessons)
  subject!: Subject;
  @OneToMany(() => Grade, grade => grade.lesson)
grades!: Grade[];
@OneToMany(() => LabWork, lab => lab.lesson)
labWorks!: LabWork[];

}

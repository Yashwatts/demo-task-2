import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmploymentType } from './enums/employment-type.enum';
import { JobStatus } from './enums/job-status.enum';
import { JobApplication } from './job-application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 150 })
  department: string;

  @Column({ length: 150 })
  location: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employment_type: EmploymentType;

  @Column({
    type: 'int',
    default: 0,
  })
  minimum_experience: number;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  required_skills: string[];

  @Column({
    type: 'timestamp with time zone',
  })
  application_deadline: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @Column({
    type: 'uuid',
  })
  created_by_id: string;

  @OneToMany(() => JobApplication, (application) => application.job_id)
  applications: JobApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

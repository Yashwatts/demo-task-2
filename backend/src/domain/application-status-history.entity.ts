import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationStatus } from './enums/application-status.enum';
import { JobApplication } from './job-application.entity';

@Entity('applications_status_histories')
export class ApplicationStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobApplication, (application) => application.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: JobApplication;

  @Column({ type: 'uuid' })
  application_id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    nullable: true,
  })
  previous_status: ApplicationStatus | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
  })
  new_status: ApplicationStatus;

  @Column({
    type: 'varchar',
  })
  changed_by_id: string;

  @Column({
    type: 'varchar',
  })
  changed_by_name: string;

  @Column({
    type: 'varchar',
  })
  changed_by_role: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

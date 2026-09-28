import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { ApplicantProfile } from './applicant-profile.entity';
import { JobApplication } from './job-application.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.APPLICANT,
  })
  role: UserRole;

  @OneToOne(() => ApplicantProfile, (profile) => profile.user_id, {
    cascade: true,
  })
  profile: ApplicantProfile;

  @OneToMany(() => JobApplication, (application) => application.applicant_id)
  applications: JobApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

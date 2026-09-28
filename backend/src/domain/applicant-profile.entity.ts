import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('applicant_profiles')
export class ApplicantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user_id: User;

  @Column({
    type: 'int',
    nullable: true,
  })
  years_of_experience: number | null;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  skills: string[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resume_url: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  about_me: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

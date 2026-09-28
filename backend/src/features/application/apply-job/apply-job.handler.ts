import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JobApplication } from 'src/domain/job-application.entity';
import { Job } from 'src/domain/job.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ApplyJobHandler {
  constructor(private readonly dataSource: DataSource) {}

  async apply(jobId: string, applicantId: string, applicantName: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const job = await queryRunner.manager.findOne(Job, {
        where: { id: jobId },
      });
      if (!job) {
        throw new NotFoundException('Job posting not found');
      }
      if (job.status === JobStatus.CLOSED) {
        throw new BadRequestException('Cannot apply to a closed job posting');
      }

      if (new Date() > new Date(job.application_deadline)) {
        throw new BadRequestException(
          'Application deadline for this job has passed',
        );
      }

      const existinApplication = await queryRunner.manager.findOne(
        JobApplication,
        {
          where: { job_id: { id: jobId }, applicant_id: { id: applicantId } },
        },
      );

      if (existinApplication) {
        throw new ConflictException(
          'You have already applied to this job posting',
        );
      }

      const application = queryRunner.manager.create(JobApplication, {
        jobId,
        applicantId,
        status: ApplicationStatus.APPLIED,
      });

      const savedApplication = await queryRunner.manager.save(application);

      const initialHistory = queryRunner.manager.create(
        ApplicationStatusHistory,
        {
          applicationId: savedApplication.id,
          previousStatus: null,
          newStatus: ApplicationStatus.APPLIED,
          changedById: applicantId,
          changedByName: applicantName,
          changedByRole: UserRole.APPLICANT,
          note: 'Application submitted by candidate',
        },
      );
      await queryRunner.manager.save(initialHistory);
      await queryRunner.commitTransaction();

      return {
        message: 'Application submitted successfully',
        application: savedApplication,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

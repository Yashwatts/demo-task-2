import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChangeApplicationStatusValidator } from './change-status.validator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JobApplication } from 'src/domain/job-application.entity';
import { ValidateStatusTransition } from '../pipeline-state-machine';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';

@Injectable()
export class ChangeStatusHandler {
  constructor(private readonly dataSource: DataSource) {}

  async changeStatus(
    applicationId: string,
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    validator: ChangeApplicationStatusValidator,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const application = await queryRunner.manager.findOne(JobApplication, {
        where: { id: applicationId },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (
        actorRole === UserRole.APPLICANT &&
        application.applicantId !== actorId
      ) {
        throw new ForbiddenException(
          'Applicants can only change the status of their own applications',
        );
      }

      ValidateStatusTransition(
        application.status,
        validator.targetStatus,
        actorRole,
      );

      const previousStatus = application.status;
      application.status = validator.targetStatus;
      await queryRunner.manager.save(application);

      const historyEntry = queryRunner.manager.create(
        ApplicationStatusHistory,
        {
          application_id: application.id,
          previous_status: previousStatus,
          new_status: validator.targetStatus,
          changed_by_id: actorId,
          changed_by_name: actorName,
          changed_by_role: actorRole,
          note: validator.note || null,
        },
      );
      await queryRunner.manager.save(historyEntry);
      await queryRunner.commitTransaction();
      return {
        message: `Application transitioned to ${validator.targetStatus}`,
        application,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

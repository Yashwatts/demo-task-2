import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from 'src/domain/job-application.entity';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';
import { ListApplicationsValidator } from './list-applications.validator';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';

@Injectable()
export class ListApplicationsHandler {
  constructor(
    @InjectRepository(JobApplication)
    private readonly applicationRepository: Repository<JobApplication>,
    @InjectRepository(ApplicationStatusHistory)
    private readonly historyRepository: Repository<ApplicationStatusHistory>,
  ) {}

  async listForAdmin(query: ListApplicationsValidator) {
    await this.autoRejectExpiredApplications();

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('app.applicant', 'applicant')
      .leftJoinAndSelect('applicant.profile', 'profile')
      .leftJoinAndSelect('app.statusHistory', 'statusHistory');

    if (query.status) {
      queryBuilder.andWhere('app.status = :status', { status: query.status });
    }

    if (query.jobId) {
      queryBuilder.andWhere('app.job_id = :jobId', { jobId: query.jobId });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(applicant.username) LIKE LOWER(:search) OR LOWER(job.title) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query.skillTag) {
      queryBuilder.andWhere(':skillTag = ANY(profile.skills)', {
        skillTag: query.skillTag,
      });
    }

    queryBuilder.orderBy('app.applied_at', 'DESC');

    const page = query.page || 1;
    const limit = query.limit || 10;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [applications, total] = await queryBuilder.getManyAndCount();

    const applicantIds = Array.from(
      new Set(applications.map((a) => a.applicantId)),
    );
    const rejectionCountsMap: Record<string, number> = {};

    if (applicantIds.length > 0) {
      const counts = await this.applicationRepository
        .createQueryBuilder('allApps')
        .select('allApps.applicant_id', 'applicantId')
        .addSelect('COUNT(allApps.id)', 'rejectionCount')
        .where('allApps.applicant_id IN (:...applicantIds)', { applicantIds })
        .andWhere('allApps.status = :rejectedStatus', {
          rejectedStatus: ApplicationStatus.REJECTED,
        })
        .groupBy('allApps.applicant_id')
        .getRawMany();

      counts.forEach((row) => {
        rejectionCountsMap[row.applicantId] = parseInt(row.rejectionCount, 10);
      });
    }

    const items = applications.map((app) => ({
      ...app,
      totalPastRejections: rejectionCountsMap[app.applicantId] || 0,
    }));

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listForApplicant(applicantId: string, status?: ApplicationStatus) {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('app.statusHistory', 'statusHistory')
      .where('app.applicant_id = :applicantId', { applicantId });

    if (status) {
      queryBuilder.andWhere('app.status = :status', { status });
    }

    queryBuilder.orderBy('app.applied_at', 'DESC');
    const applications = await queryBuilder.getMany();

    return applications;
  }

  async getApplicationHistory(
    applicationId: string,
    requesterId: string,
    requesterRole: string,
  ) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (
      requesterRole === 'applicant' &&
      application.applicantId !== requesterId
    ) {
      throw new NotFoundException('Application not accessible');
    }

    const histories = await this.historyRepository.find({
      where: { application_id: applicationId },
      order: { createdAt: 'ASC' },
    });

    return histories;
  }

  private async autoRejectExpiredApplications(): Promise<void> {
    const now = new Date();
    const expiredApplications = await this.applicationRepository
      .createQueryBuilder('app')
      .innerJoin('app.job', 'job')
      .where('app.status = :status', { status: ApplicationStatus.APPLIED })
      .andWhere('job.application_deadline < :now', { now })
      .getMany();

    if (expiredApplications.length === 0) return;

    for (const app of expiredApplications) {
      app.status = ApplicationStatus.REJECTED;
      await this.applicationRepository.save(app);

      const history = this.historyRepository.create({
        application_id: app.id,
        previous_status: ApplicationStatus.APPLIED,
        new_status: ApplicationStatus.REJECTED,
        changed_by_id: 'SYSTEM',
        changed_by_name: 'system',
        changed_by_role: 'system',
        note: 'Application automatically rejected because the job application deadline has passed.',
      });
      await this.historyRepository.save(history);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from 'src/domain/job-application.entity';
import { Job } from 'src/domain/job.entity';
import { Repository } from 'typeorm';
import { ListJobsValidator } from './list-jobs.validator';
import { JobStatus } from 'src/domain/enums/job-status.enum';

@Injectable()
export class ListJobsHandler {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly applicationRepository: Repository<JobApplication>,
  ) { }

  async listJobsForAdmin(query: ListJobsValidator) {
    const queryBuilder = this.jobRepository.createQueryBuilder('job');

    if (query.search) {
      queryBuilder.andWhere('LOWER(job.title) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.department) {
      queryBuilder.andWhere('LOWER(job.department) = LOWER(:department)', {
        department: query.department,
      });
    }

    if (query.location) {
      queryBuilder.andWhere('LOWER(job.location) = LOWER(:location)', {
        location: query.location,
      });
    }

    if (query.employmentType) {
      queryBuilder.andWhere('job.employmentType = :employmentType', {
        employmentType: query.employmentType,
      });
    }

    if (query.minExperience !== undefined) {
      queryBuilder.andWhere('job.minimumExperience <= :minExp', {
        minExp: query.minExperience,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('job.status = :status', { status: query.status });
    }

    if (query.tag) {
      queryBuilder.andWhere(':tag = ANY(job.requiredSkills)', {
        tag: query.tag,
      });
    }

    const sortField =
      query.sortBy === 'applicationDeadline'
        ? 'job.applicationDeadline'
        : 'job.createdAt';
    queryBuilder.orderBy(sortField, query.sortOrder || 'DESC');

    const page = query.page;
    const limit = query.limit;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [jobs, total] = await queryBuilder.getManyAndCount();

    const jobIds = jobs.map((job) => job.id);
    const summaryMap: Record<string, any> = {};

    if (jobIds.length > 0) {
      const summaries = await this.applicationRepository
        .createQueryBuilder('app')
        .select('app.jobId', 'jobId')
        .addSelect('app.status', 'status')
        .addSelect('COUNT(app.id)', 'count')
        .where('app.jobId IN (:...jobIds)', { jobIds })
        .groupBy('app.jobId')
        .addGroupBy('app.status')
        .getRawMany();

      summaries.forEach((row) => {
        if (!summaryMap[row.jobId]) {
          summaryMap[row.jobId] = {
            total: 0,
            applied: 0,
            shortlisted: 0,
            interview: 0,
            offer: 0,
            hired: 0,
            rejected: 0,
            withdrawn: 0,
          };
        }
        const count = parseInt(row.count, 10);
        summaryMap[row.jobId][row.status] = count;
        summaryMap[row.jobId].total += count;
      });
    }

    const jobsWithSummary = jobs.map((job) => ({
      ...job,
      summary: summaryMap[job.id] || {
        total: 0,
        applied: 0,
        shortlisted: 0,
        interview: 0,
        offer: 0,
        hired: 0,
        rejected: 0,
        withdrawn: 0,
      },
    }));

    return {
      items: jobsWithSummary,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listJobsForApplicant(query: ListJobsValidator) {
    const queryBuilder = this.jobRepository.createQueryBuilder('job');

    queryBuilder
      .where('job.status = :status', { status: JobStatus.OPEN })
      .andWhere('job.applicationDeadline > :now', { now: new Date() });

    if (query.search) {
      queryBuilder.andWhere('LOWER(job.title) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.department) {
      queryBuilder.andWhere('LOWER(job.department) = LOWER(:department)', {
        department: query.department,
      });
    }

    if (query.location) {
      queryBuilder.andWhere('LOWER(job.location) = LOWER(:location)', {
        location: query.location,
      });
    }

    if (query.employmentType) {
      queryBuilder.andWhere('job.employmentType = :employmentType', {
        employmentType: query.employmentType,
      });
    }

    if (query.minExperience !== undefined) {
      queryBuilder.andWhere('job.minimumExperience <= :minExp', {
        minExp: query.minExperience,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere(':tag = ANY(job.requiredSkills)', {
        tag: query.tag,
      });
    }

    const sortField =
      query.sortBy === 'applicationDeadline'
        ? 'job.applicationDeadline'
        : 'job.createdAt';
    queryBuilder.orderBy(sortField, query.sortOrder || 'DESC');

    const page = query.page || 1;
    const limit = query.limit || 10;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [jobs, total] = await queryBuilder.getManyAndCount();

    return {
      items: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobDetail(jobId: string) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}

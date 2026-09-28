import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobValidator } from './create-job.validator';
import { Job } from 'src/domain/job.entity';
import { JobStatus } from 'src/domain/enums/job-status.enum';

@Injectable()
export class CreateJobHandler {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(adminId: string, createJobValidator: CreateJobValidator) {
    const job = this.jobRepository.create({
      ...createJobValidator,
      application_deadline: new Date(createJobValidator.applicationDeadline),
      status: JobStatus.OPEN,
      created_by_id: adminId,
    });

    const savedJob = await this.jobRepository.save(job);
    return {
      message: 'Job posting created successfully',
      job: savedJob,
    };
  }
}

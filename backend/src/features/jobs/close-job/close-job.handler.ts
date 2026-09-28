import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'src/domain/job.entity';
import { JobStatus } from 'src/domain/enums/job-status.enum';

@Injectable()
export class CloseJobHandler {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async closeJob(jobId: string) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    job.status = JobStatus.CLOSED;
    const closedJob = await this.jobRepository.save(job);
    return {
      message: 'Job marked as closed',
      job: closedJob,
    };
  }
}

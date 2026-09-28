import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditJobValidator } from './edit-job.validator';
import { Job } from 'src/domain/job.entity';
import { JobStatus } from 'src/domain/enums/job-status.enum';

@Injectable()
export class EditJobHandler {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async editJob(jobId: string, editJobValidator: EditJobValidator) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (editJobValidator.title) job.title = editJobValidator.title;
    if (editJobValidator.department)
      job.department = editJobValidator.department;
    if (editJobValidator.location) job.location = editJobValidator.location;
    if (editJobValidator.employmentType)
      job.employment_type = editJobValidator.employmentType;
    if (editJobValidator.minimumExperience !== undefined)
      job.minimum_experience = editJobValidator.minimumExperience;
    if (editJobValidator.requiredSkills)
      job.required_skills = editJobValidator.requiredSkills;
    if (editJobValidator.applicationDeadline) {
      job.application_deadline = new Date(editJobValidator.applicationDeadline);
    }
    if (editJobValidator.status) job.status = editJobValidator.status;

    const updatedJob = await this.jobRepository.save(job);
    return {
      message: 'Job updated successfully',
      job: updatedJob,
    };
  }
}

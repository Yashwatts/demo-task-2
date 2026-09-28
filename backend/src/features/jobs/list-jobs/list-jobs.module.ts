import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/domain/job.entity';
import { JobApplication } from 'src/domain/job-application.entity';
import { ListJobsController } from './list-jobs.controller';
import { ListJobsHandler } from './list-jobs.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobApplication])],
  controllers: [ListJobsController],
  providers: [ListJobsHandler],
})
export class ListJobsModule {}

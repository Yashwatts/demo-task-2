import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/domain/job.entity';
import { ApplyJobController } from './apply-job.controller';
import { ApplyJobHandler } from './apply-job.handler';
import { JobApplication } from 'src/domain/job-application.entity';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobApplication, ApplicationStatusHistory]),
  ],
  controllers: [ApplyJobController],
  providers: [ApplyJobHandler],
})
export class ApplyJobModule {}

import { Module } from '@nestjs/common';
import { CreateJobModule } from './create-job/create-job.module';
import { EditJobModule } from './edit-job/edit-job.module';
import { CloseJobModule } from './close-job/close-job.module';
import { ListJobsModule } from './list-jobs/list-jobs.module';

@Module({
  imports: [CreateJobModule, EditJobModule, CloseJobModule, ListJobsModule],
  providers: [],
})
export class JobsModule {}

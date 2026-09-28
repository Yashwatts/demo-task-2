import { Module } from '@nestjs/common';
import { ApplyJobModule } from './apply-job/apply-job.module';
import { ChangeStatusModule } from './change-status/change-status.module';
import { ListApplicationsModule } from './list-applications/list-applications.module';

@Module({
  imports: [ApplyJobModule, ChangeStatusModule, ListApplicationsModule],
  providers: [],
})
export class ApplicationModule {}

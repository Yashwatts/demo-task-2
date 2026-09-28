import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from 'src/domain/job-application.entity';
import { ListApplicationsController } from './list-applications.controller';
import { ListApplicationsHandler } from './list-applications.handler';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, ApplicationStatusHistory]),
  ],
  controllers: [ListApplicationsController],
  providers: [ListApplicationsHandler],
})
export class ListApplicationsModule {}

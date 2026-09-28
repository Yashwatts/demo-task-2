import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from 'src/domain/job-application.entity';
import { ChangeStatusController } from './change-status.controller';
import { ChangeStatusHandler } from './change-status.handler';
import { ApplicationStatusHistory } from 'src/domain/application-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, ApplicationStatusHistory]),
  ],
  controllers: [ChangeStatusController],
  providers: [ChangeStatusHandler],
})
export class ChangeStatusModule {}

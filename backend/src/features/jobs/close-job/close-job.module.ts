import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/domain/job.entity';
import { CloseJobController } from './close-job.controller';
import { CloseJobHandler } from './close-job.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [CloseJobController],
  providers: [CloseJobHandler],
})
export class CloseJobModule {}

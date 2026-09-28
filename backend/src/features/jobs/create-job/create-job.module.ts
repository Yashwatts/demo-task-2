import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateJobController } from './create-job.controller';
import { CreateJobHandler } from './create-job.handler';
import { Job } from 'src/domain/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [CreateJobController],
  providers: [CreateJobHandler],
})
export class CreateJobModule {}

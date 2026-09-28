import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/domain/job.entity';
import { EditJobHandler } from './edit-job.handler';
import { EditJobController } from './edit-job.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [EditJobController],
  providers: [EditJobHandler],
})
export class EditJobModule {}

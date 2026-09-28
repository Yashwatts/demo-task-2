import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';
import { UploadResumeController } from './upload-resume.controller';
import { UploadResumeHandler } from './upload-resume.handler';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicantProfile])],
  controllers: [UploadResumeController],
  providers: [UploadResumeHandler],
})
export class UploadResumeModule {}

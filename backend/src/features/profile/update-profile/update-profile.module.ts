import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';
import { UpdateProfileController } from './update-profile.controller';
import { UpdateProfileHandler } from './update-profile.handler';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicantProfile])],
  controllers: [UpdateProfileController],
  providers: [UpdateProfileHandler],
})
export class UpdateProfileModule {}

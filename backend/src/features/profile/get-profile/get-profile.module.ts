import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { GetProfileController } from './get-profile.controller';
import { GetProfileHandler } from './get-profile.handler';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApplicantProfile])],
  controllers: [GetProfileController],
  providers: [GetProfileHandler],
})
export class GetProfileModule {}

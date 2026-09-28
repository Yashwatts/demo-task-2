import { Module } from '@nestjs/common';
import { GetProfileModule } from './get-profile/get-profile.module';
import { UpdateProfileModule } from './update-profile/update-profile.module';
import { UploadResumeModule } from './upload-resume/upload-resume.module';

@Module({
  imports: [GetProfileModule, UpdateProfileModule, UploadResumeModule],
  providers: [],
})
export class ProfileModule {}

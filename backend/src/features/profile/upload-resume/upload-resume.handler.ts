import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadResumeHandler {
  constructor(
    @InjectRepository(ApplicantProfile)
    private readonly profileRepository: Repository<ApplicantProfile>,
  ) {}

  async saveResumePath(userId: string, filename: string) {
    if (!filename) {
      throw new BadRequestException('No resume file provided');
    }

    const resumeUrl = `/uploads/resumes/${filename}`;
    let profile = await this.profileRepository.findOne({
      where: { id: userId },
    });

    if (!profile) {
      profile = this.profileRepository.create({
        id: userId,
        resume_url: resumeUrl,
        skills: [],
      });
    } else {
      profile.resume_url = resumeUrl;
    }

    await this.profileRepository.save(profile);

    return {
      message: 'Resume uploaded successfully',
      resumeUrl,
    };
  }
}

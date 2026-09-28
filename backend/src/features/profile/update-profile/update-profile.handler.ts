import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileValidator } from './update-profile.validator';

@Injectable()
export class UpdateProfileHandler {
  constructor(
    @InjectRepository(ApplicantProfile)
    private readonly profileRepository: Repository<ApplicantProfile>,
  ) {}

  async updateProfile(
    userId: string,
    updateProfileValidator: UpdateProfileValidator,
  ) {
    let profile = await this.profileRepository.findOne({
      where: { id: userId },
    });
    if (!profile) {
      profile = this.profileRepository.create({
        id: userId,
        years_of_experience: updateProfileValidator.yearsOfExperience ?? null,
        skills: updateProfileValidator.skills ?? [],
        about_me: updateProfileValidator.aboutMe ?? null,
      });
    } else {
      if (updateProfileValidator.yearsOfExperience !== undefined) {
        profile.years_of_experience = updateProfileValidator.yearsOfExperience;
      }
      if (updateProfileValidator.skills !== undefined) {
        profile.skills = updateProfileValidator.skills;
      }
      if (updateProfileValidator.aboutMe !== undefined) {
        profile.about_me = updateProfileValidator.aboutMe;
      }
    }

    const savedProfile = await this.profileRepository.save(profile);
    return {
      message: 'Profile updated successfully',
      profile: savedProfile,
    };
  }
}

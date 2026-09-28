import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantProfile } from 'src/domain/applicant-profile.entity';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetProfileHandler {
  constructor(
    @InjectRepository(ApplicantProfile)
    private readonly profileRepository: Repository<ApplicantProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'role', 'createdAt'],
    });
    if (!user) {
      throw new NotFoundException('User Profile not found');
    }
    let profile = await this.profileRepository.findOne({
      where: { id: userId },
    });
    if (!profile) {
      profile = this.profileRepository.create({
        id: userId,
        years_of_experience: null,
        skills: [],
        resume_url: null,
        about_me: null,
      });
      profile = await this.profileRepository.save(profile);
    }
    return {
      user,
      profile,
    };
  }
}

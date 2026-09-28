import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { GetProfileHandler } from './get-profile.handler';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('profile')
@UseGuards(RolesGuard)
export class GetProfileController {
  constructor(private readonly getProfileHandler: GetProfileHandler) {}

  @Get('me')
  @Roles(UserRole.APPLICANT, UserRole.ADMIN)
  async getMyProfile(@Req() req: Request) {
    const currentUserId = req['user'].id;
    return this.getProfileHandler.getProfile(currentUserId);
  }

  @Get(':userId')
  @Roles(UserRole.ADMIN)
  async getApplicantProfileByAdmin(@Param('userId') userId: string) {
    return this.getProfileHandler.getProfile(userId);
  }
}

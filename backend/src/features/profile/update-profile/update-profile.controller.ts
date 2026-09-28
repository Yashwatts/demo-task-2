import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { UpdateProfileHandler } from './update-profile.handler';
import { UpdateProfileValidator } from './update-profile.validator';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import type { Request } from 'express';

@Controller('profile/me')
@UseGuards(RolesGuard)
export class UpdateProfileController {
  constructor(private readonly updateProfileHandler: UpdateProfileHandler) {}

  @Put()
  @Roles(UserRole.APPLICANT)
  async updateMyProfile(
    @Req() req: Request,
    @Body() updateProfileValidator: UpdateProfileValidator,
  ) {
    const currentUserId = req['user'].id;
    return this.updateProfileHandler.updateProfile(
      currentUserId,
      updateProfileValidator,
    );
  }
}

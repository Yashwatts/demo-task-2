import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { ChangeStatusHandler } from './change-status.handler';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { ChangeApplicationStatusValidator } from './change-status.validator';
import type { Request } from 'express';

@Controller('applications')
@UseGuards(RolesGuard)
export class ChangeStatusController {
  constructor(private readonly changeStatusHandler: ChangeStatusHandler) {}

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.APPLICANT)
  async updateStatus(
    @Param('id') id: string,
    @Body() validator: ChangeApplicationStatusValidator,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.changeStatusHandler.changeStatus(
      id,
      user.id,
      user.username,
      user.role,
      validator,
    );
  }
}

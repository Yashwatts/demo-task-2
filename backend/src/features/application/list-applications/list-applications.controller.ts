import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { ListApplicationsHandler } from './list-applications.handler';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { ListApplicationsValidator } from './list-applications.validator';
import type { Request } from 'express';

@Controller('applications')
@UseGuards(RolesGuard)
export class ListApplicationsController {
  constructor(
    private readonly listApplicationsHandler: ListApplicationsHandler,
  ) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  async listAdminApplications(@Query() query: ListApplicationsValidator) {
    return this.listApplicationsHandler.listForAdmin(query);
  }

  @Get('my')
  @Roles(UserRole.APPLICANT)
  async listMyApplications(@Req() req: Request, @Query('status') status?: any) {
    const applicantId = req['user'].id;
    return this.listApplicationsHandler.listForApplicant(applicantId, status);
  }

  @Get(':id/history')
  @Roles(UserRole.ADMIN, UserRole.APPLICANT)
  async getApplicationHistory(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.listApplicationsHandler.getApplicationHistory(
      id,
      user.id,
      user.role,
    );
  }
}

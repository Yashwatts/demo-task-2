import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ListJobsHandler } from './list-jobs.handler';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { ListJobsValidator } from './list-jobs.validator';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('jobs')
@UseGuards(RolesGuard)
export class ListJobsController {
  constructor(private readonly listJobsHandler: ListJobsHandler) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  async listAdminJobs(@Query() query: ListJobsValidator) {
    return this.listJobsHandler.listJobsForAdmin(query);
  }

  @Get('applicant')
  @Roles(UserRole.APPLICANT)
  async listApplicantJobs(@Query() query: ListJobsValidator) {
    return this.listJobsHandler.listJobsForApplicant(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.APPLICANT)
  async getJobDetail(@Param('id') id: string) {
    return this.listJobsHandler.getJobDetail(id);
  }
}

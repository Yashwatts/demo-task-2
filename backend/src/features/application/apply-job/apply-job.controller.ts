import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { ApplyJobHandler } from './apply-job.handler';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import type { Request } from 'express';

@Controller('applications')
@UseGuards(RolesGuard)
export class ApplyJobController {
  constructor(private readonly applyJobHandler: ApplyJobHandler) {}

  @Post(':jobId/apply')
  @Roles(UserRole.APPLICANT)
  async applyToJob(@Param('jobId') jobId: string, @Req() req: Request) {
    const user = req['user'];
    return this.applyJobHandler.apply(jobId, user.id, user.username);
  }
}

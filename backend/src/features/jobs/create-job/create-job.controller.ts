import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateJobHandler } from './create-job.handler';
import { CreateJobValidator } from './create-job.validator';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import type { Request } from 'express';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('jobs')
@UseGuards(RolesGuard)
export class CreateJobController {
  constructor(private readonly createJobHandler: CreateJobHandler) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createJob(
    @Req() req: Request,
    @Body() createJobValidator: CreateJobValidator,
  ) {
    const adminId = req['user'].id;
    return this.createJobHandler.createJob(adminId, createJobValidator);
  }
}

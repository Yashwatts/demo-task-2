import {
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { CloseJobHandler } from './close-job.handler';

@Controller('jobs/:id/close')
@UseGuards(RolesGuard)
export class CloseJobController {
  constructor(private readonly closeJobHandler: CloseJobHandler) {}

  @Patch()
  @Roles(UserRole.ADMIN)
  async closeJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.closeJobHandler.closeJob(id);
  }
}

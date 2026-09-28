import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EditJobHandler } from './edit-job.handler';
import { EditJobValidator } from './edit-job.validator';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('jobs/:id')
@UseGuards(RolesGuard)
export class EditJobController {
  constructor(private readonly editJobHandler: EditJobHandler) {}

  @Put()
  @Roles(UserRole.ADMIN)
  async editJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editJobValidator: EditJobValidator,
  ) {
    return this.editJobHandler.editJob(id, editJobValidator);
  }
}

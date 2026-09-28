import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadResumeHandler } from './upload-resume.handler';
import { RolesGuard } from 'src/infrastructure/app/guards/roles.guard';
import { Roles } from 'src/infrastructure/app/guards/roles.decorator';
import type { Request } from 'express';
import { UserRole } from 'src/domain/enums/user-role.enum';

@Controller('profile/resume/upload')
@UseGuards(RolesGuard)
export class UploadResumeController {
  constructor(private readonly uploadResumeHandler: UploadResumeHandler) {}

  @Post()
  @Roles(UserRole.APPLICANT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          cb(null, `resume-${req['user'].id}-${uniqueSuffix}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
          return cb(
            new BadRequestException(
              'Only PDF and Word documents are supported!',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadResume(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a valid resume file');
    }
    const currentUserId = req['user'].id;
    return this.uploadResumeHandler.saveResumePath(
      currentUserId,
      file.filename,
    );
  }
}

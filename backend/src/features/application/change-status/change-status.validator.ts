import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';

export class ChangeApplicationStatusValidator {
  @IsEnum(ApplicationStatus)
  targetStatus: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

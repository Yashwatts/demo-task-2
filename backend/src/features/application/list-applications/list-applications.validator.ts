import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';

export class ListApplicationsValidator {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 3;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsString()
  skillTag?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minRejections?: number;
}

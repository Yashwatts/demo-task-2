import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EmploymentType } from 'src/domain/enums/employment-type.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export class ListJobsValidator {
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
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minExperience?: number;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  sortBy: 'createdAt' | 'applicationDeadline' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}

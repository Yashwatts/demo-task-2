import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { EmploymentType } from 'src/domain/enums/employment-type.enum';

export class CreateJobValidator {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsInt()
  @Min(0)
  minimumExperience: number;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsDateString()
  applicationDeadline: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupUserValidator {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;
  @MinLength(6)
  @MaxLength(255)
  password: string;
}

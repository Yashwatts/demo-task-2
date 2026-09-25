import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserValidator {
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

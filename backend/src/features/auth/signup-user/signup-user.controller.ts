import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignupUserHandler } from './signup-user.handler';
import { SignupUserValidator } from './signup-user.validator';
import { setCookie } from 'src/infrastructure/app/cookies/auth.cookie';
import type { Response } from 'express';

@Controller('auth/signup')
export class SignupUserController {
  constructor(private readonly signupUserHandler: SignupUserHandler) {}

  @Post()
  async signup(
    @Body() signupUserValidator: SignupUserValidator,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } =
      await this.signupUserHandler.signup(signupUserValidator);

    setCookie(res, token);
    return { message: 'User Created Successfully', user };
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { setCookie } from 'src/infrastructure/app/cookies/auth.cookie';
import type { Response } from 'express';
import { LoginUserHandler } from './login-user.handler';
import { LoginUserValidator } from './login-user.validator';

@Controller('auth/login')
export class LoginUserController {
  constructor(private readonly loginUserHandler: LoginUserHandler) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async login(
    @Body() loginUserValidator: LoginUserValidator,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } =
      await this.loginUserHandler.login(loginUserValidator);
    setCookie(res, token);
    return { message: 'User logged in successfully', user };
  }
}

import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { clearCookie } from 'src/infrastructure/app/cookies/auth.cookie';

@Controller('auth/logout')
export class LogoutUserController {
  @HttpCode(HttpStatus.OK)
  @Post()
  async logout(@Res({ passthrough: true }) res: Response) {
    clearCookie(res);
    return { message: 'User logged out successfully' };
  }
}

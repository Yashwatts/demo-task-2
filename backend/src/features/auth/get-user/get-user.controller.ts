import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { GetUserHandler } from './get-user.handler';

@Controller('auth/me')
export class GetUserController {
  constructor(private readonly getUserHandler: GetUserHandler) {}

  @Get()
  async getUser(@Req() req) {
    const userId = req.user.id;
    const user = await this.getUserHandler.GetUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}

import { Module } from '@nestjs/common';
import { LogoutUserController } from './logout-user.controller';

@Module({
  controllers: [LogoutUserController],
  providers: [],
})
export class LogoutUserModule {}

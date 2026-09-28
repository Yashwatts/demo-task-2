import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { LoginUserController } from './login-user.controller';
import { LoginUserHandler } from './login-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [LoginUserController],
  providers: [LoginUserHandler],
})
export class LoginUserModule {}

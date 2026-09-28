import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { SignupUserController } from './signup-user.controller';
import { SignupUserHandler } from './signup-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SignupUserController],
  providers: [SignupUserHandler],
})
export class SignupUserModule {}

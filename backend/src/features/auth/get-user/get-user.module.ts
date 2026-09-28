import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { GetUserController } from './get-user.controller';
import { GetUserHandler } from './get-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GetUserController],
  providers: [GetUserHandler],
})
export class GetUserModule {}

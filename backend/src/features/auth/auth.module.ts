import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignupUserModule } from './signup-user/signup-user.module';
import { LoginUserModule } from './login-user/login-user.module';
import { LogoutUserModule } from './logout-user/logout-user.module';
import { GetUserModule } from './get-user/get-user.module';

@Module({
  imports: [
    SignupUserModule,
    LoginUserModule,
    LogoutUserModule,
    GetUserModule,
  ],
  providers: [],
})
export class AuthModule {}

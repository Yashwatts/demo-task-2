import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupUserValidator } from './signup-user.validator';
import { User } from 'src/domains/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupUserHandler {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupUserValidator: SignupUserValidator) {
    const { username, email, password } = signupUserValidator;
    const userByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (userByUsername) {
      throw new ConflictException('Username is already taken.');
    }
    const userByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (userByEmail) {
      throw new ConflictException('Email is already registered.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: passwordHash,
    });
    const savedUser = await this.userRepository.save(newUser);
    const token = this.jwtService.sign({
      id: savedUser.id,
      sub: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    });
    return {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      },
      token,
    };
  }
}

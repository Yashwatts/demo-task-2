import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domains/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserHandler {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async GetUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

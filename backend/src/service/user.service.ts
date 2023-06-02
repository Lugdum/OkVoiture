import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(@Query('email') email: string): Promise<UserEntity> {
    let a = await this.usersRepository.findOne({
      where: { email },
    });
    return a;
  }

  async findOnePwd(@Query('email') email: string, @Query('password') password: string): Promise<UserEntity> {
    let a = await this.usersRepository.findOne({
      where: { email, password },
    });
    return a;
  }

  async remove(id: string): Promise<{ message: string }> {
    let a = await this.usersRepository.delete(id);
    return { message: "User deleted"}
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(user);
  }
}

import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    let users = await this.userService.findAll();
    let usersNoPwd = users.map((user) => {
      let userNoPwd = { ...user };
      delete userNoPwd.password;
      return userNoPwd;
    });
    return usersNoPwd;
  }

  @Get('log')
  async findOne(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    if (!password) return { message: 'User not found', code: 404 };
    let newUser = await this.userService.findOnePwd(email, password);
    if (!newUser) return { message: 'User not found', code: 404 };
    let newUserNoPwd = { ...newUser };
    delete newUserNoPwd.password;

    return newUserNoPwd;
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
    let newUser = await this.userService.findOneById(id);
    if (!newUser) return { message: 'User not found', code: 404 };
    let newUserNoPwd = { ...newUser };
    delete newUserNoPwd.password;

    return newUserNoPwd;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Post()
  async create(@Body() user: UserEntity) {
    let exists = await this.userService.findOne(user.email);
    if (exists) return { message: 'Email already taken', code: 409 };

    let newUser = await this.userService.create(user);
    let newUserNoPwd = { ...newUser };
    delete newUserNoPwd.password;

    return newUserNoPwd;
  }
}

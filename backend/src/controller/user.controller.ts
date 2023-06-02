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
  findAll() {
    return this.userService.findAll();
  }

  @Get('log')
  async findOne(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    let a = await this.userService.findOnePwd(email, password);
    if (!a) return { message: 'User not found', code: 404 };
    return a;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post()
  async create(@Body() user: UserEntity) {
    let a = await this.userService.findOne(user.email);
    if (a) return { message: 'Email already taken', code: 409 };
    return this.userService.create(user);
  }
}

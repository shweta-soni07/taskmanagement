import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }
}

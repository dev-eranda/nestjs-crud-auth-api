import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { Users } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@GetUser() user: Users) {
    return user;
  }

  @Patch('edit')
  editUser(@GetUser('sub') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}

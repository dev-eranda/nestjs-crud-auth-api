import { Controller, Get } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { Users } from '@prisma/client';

@Controller('user')
export class UserController {

    @Get('profile')
    getProfile(@GetUser() user: Users) { // @GetUser('email') email: string 
        return user;
    }
}

import { Controller } from '@nestjs/common';
import { Get, UseGuards, Request } from '@nestjs/common';
import { Public } from '../auth/auth.decorator';

@Controller('user')
export class UserController {

    @Get('auth')
    profile() {
        return 'auth route';
    }

    @Public()
    @Get('public')
    public() {
        return 'public route';
    }
}

import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ) { }
    async signup(dto: AuthDto) {
        try {
            // find the user by email
            const userByEmail = await this.prismaService.users.findUnique({
                where: {
                    email: dto.email
                }
            });

            if (userByEmail) throw new ForbiddenException('Credentials taken')

            // generate the password hash
            const hash = await argon.hash(dto.password);

            // save user to db
            const user = await this.prismaService.users.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            return this.createtoken(user.id, user.email);
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;
        }

    }

    async signin(dto: AuthDto) {

        try {
            // find the user by email
            const user = await this.prismaService.users.findUnique({
                where: {
                    email: dto.email
                }
            });

            // if user does not exist throw an exception  
            if (!user) throw new UnauthorizedException();

            // compare password 
            const pwMatches = await argon.verify(user.hash, dto.password);

            // if passwrod incorrect throw an exception
            if (!pwMatches) throw new UnauthorizedException();

            return this.createtoken(user.id, user.email);
        }
        catch (error) {
            throw error;
        }
    }

    async createtoken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            secret: secret,
        })

        return {
            access_token: token,
        }
    }

}
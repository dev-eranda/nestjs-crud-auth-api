import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) { }
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
            delete user.hash;

            // return thr saved user 
            return user;
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
            if (!user) throw new ForbiddenException('Credentials incorrect');

            // compare password 
            const pwMatches = await argon.verify(user.hash, dto.password);

            // if passwrod incorrect throw an exception
            if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

            // send back the user
            delete user.hash;
            return user;
        }
        catch (error) {
            throw error;
        }
    }
}
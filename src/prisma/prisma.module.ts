import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //prisma service availale to all the modules in app
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule { }

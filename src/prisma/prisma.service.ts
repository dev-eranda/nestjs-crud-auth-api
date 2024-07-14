import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  // clean db
  // not used ondelete: cascade in schema.prisma
  // because delete firt meals
  cleandb() {
    return this.$transaction([
      this.meals.deleteMany(),
      this.users.deleteMany(),
    ]);
  }
}

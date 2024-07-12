import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [AuthModule, UserModule, MealsModule],
})
export class AppModule {}

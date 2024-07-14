import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { GetUser } from '../auth/decorator';
import { CreateMealsDto, EditMealsDto } from './dto';

@Controller('meals')
export class MealsController {
  constructor(private mealService: MealsService) {}

  @Post('create')
  createMeals(@GetUser('sub') userId: number, @Body() dto: CreateMealsDto) {
    return this.mealService.createMeals(userId, dto);
  }

  @Get()
  getMeals(@GetUser('sub') userId: number) {
    return this.mealService.getMeals(userId);
  }

  @Get(':id')
  getMealById(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) mealId: number,
  ) {
    return this.mealService.getMealById(userId, mealId);
  }

  @Patch(':id')
  editMealById(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) mealId: number,
    @Body() dto: EditMealsDto,
  ) {
    return this.mealService.editMealById(userId, mealId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMealById(
    @GetUser('sub') userId: number,
    @Param('id', ParseIntPipe) mealId: number,
  ) {
    return this.mealService.deleteMealById(userId, mealId);
  }
}

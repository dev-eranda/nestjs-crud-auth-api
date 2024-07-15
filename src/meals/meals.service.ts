import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealsDto, EditMealsDto } from './dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) { }

  async createMeals(userId: number, dto: CreateMealsDto) {
    try {
      const meals = await this.prisma.meals.create({
        data: {
          userId,
          ...dto
        }
      });

      return meals;
    } catch (error) {
      throw error;
    }
  }

  async getMeals(userId: number) {
    try {
      const meals = await this.prisma.meals.findMany({
        where: {
          userId,
        },
      });

      return meals;
    } catch (error) {
      throw error;
    }
  }

  async getMealById(userId: number, mealId: number) {
    try {
      const meals = await this.prisma.meals.findFirst({
        where: {
          userId,
          id: mealId,
        },
      });

      if (!meals) {
        throw new HttpException('Meal not found', HttpStatus.NOT_FOUND);
      }

      return meals;
    } catch (error) {
      throw error;
    }
  }

  async editMealById(userId: number, mealId: number, dto: EditMealsDto) {
    try {
      // get meals by id
      const meals = await this.prisma.meals.findUnique({
        where: {
          id: mealId,
        },
      });

      // check if user is the owner of the meal
      if (!meals) {
        throw new NotFoundException('Meal not found');
      }

      if (meals.userId !== userId) {
        throw new ForbiddenException('Access to resource denied');
      }

      // modify
      return this.prisma.meals.update({
        where: {
          id: mealId,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteMealById(userId: number, mealId: number) {
    try {
      // get meals by id
      const meals = await this.prisma.meals.findUnique({
        where: {
          id: mealId,
        },
      });

      // check if user is the owner of the meal
      if (!meals) {
        throw new NotFoundException('Meal not found');
      }

      if (meals.userId !== userId) {
        throw new ForbiddenException('Access to resource denied');
      }

      // delete
      await this.prisma.meals.delete({
        where: {
          id: mealId,
        },
      });

      // return response message
      return { message: 'Meal successfully deleted' };

    } catch (error) {
      throw error;
    }
  }
}

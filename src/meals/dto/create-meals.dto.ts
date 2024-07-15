import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMealsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}

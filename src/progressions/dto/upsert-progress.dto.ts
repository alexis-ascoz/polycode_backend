import { IsString, IsNumber } from 'class-validator';

export class UpsertProgressDto {
  @IsNumber()
  score: number;

  @IsString()
  code: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  exerciseId: number;
}

import { IsString } from 'class-validator';

export class RunExerciseDto {
  @IsString()
  code: string;
}

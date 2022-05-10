import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { IsString, Validate } from 'class-validator';
import { CodeLanguage } from 'src/run/run.types';
import { CodeLanguageValidator } from './validators/CodeLanguageValidator';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  instructions: string;

  @IsString()
  baseCode: string;

  @Validate(CodeLanguageValidator)
  codeLanguage: CodeLanguage;
}

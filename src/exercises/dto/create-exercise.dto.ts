import { IsString, Validate } from 'class-validator';
import { CodeLanguage } from 'src/run/run.types';
import { CodeLanguageValidator } from './validators/CodeLanguageValidator';

export class CreateExerciseDto {
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

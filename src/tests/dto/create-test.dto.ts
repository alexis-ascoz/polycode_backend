import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTestDto {
  @IsNumber()
  exerciseId: number;

  @IsString()
  name: string;

  @IsString()
  input: string;

  @IsString()
  output: string;

  @IsBoolean()
  hidden: boolean;
}

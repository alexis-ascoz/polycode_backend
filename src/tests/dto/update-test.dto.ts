import { PartialType } from '@nestjs/swagger';
import { CreateTestDto } from './create-test.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @IsString()
  name: string;

  @IsString()
  input: string;

  @IsString()
  output: string;

  @IsBoolean()
  hidden: boolean;
}

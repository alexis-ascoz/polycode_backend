import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from 'src/auth/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RunExerciseDto } from './dto/run-exercise.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @UseGuards(AuthGuard('jwtAdmin'))
  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('exercise/:id')
  findAllByExercise(@Param('id') id: string) {
    return this.testsService.findAllByExerciseWithoutHiddenTests(+id);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Get('exercise/:id/hidden')
  findAllByExerciseWithHiddenTests(@Param('id') id: string) {
    return this.testsService.findAllByExercise(+id);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+id, updateTestDto);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/run')
  run(
    @Param('id') id: string,
    @ReqUser() user: User,
    @Body() runExerciseDto: RunExerciseDto,
  ) {
    return this.testsService.run(+id, runExerciseDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('exercise/:id/run')
  runAllByExercise(
    @Param('id') id: string,
    @ReqUser() user: User,
    @Body() runExerciseDto: RunExerciseDto,
  ) {
    return this.testsService.runAllByExercise(+id, runExerciseDto, user);
  }
}

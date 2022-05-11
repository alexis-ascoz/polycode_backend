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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from 'src/auth/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(AuthGuard('jwtAdmin'))
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@ReqUser() user: User) {
    return this.exercisesService.findAllWithUserInfo(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @ReqUser() user: User) {
    return this.exercisesService.findOneWithUserInfo(+id, user);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(+id, updateExerciseDto);
  }

  @UseGuards(AuthGuard('jwtAdmin'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(+id);
  }
}

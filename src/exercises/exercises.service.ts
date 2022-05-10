import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  create(createExerciseDto: CreateExerciseDto) {
    return Exercise.build({ ...createExerciseDto }).save();
  }

  findAll() {
    return Exercise.findAll();
  }

  async findOne(id: number) {
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found.`);
    }

    return exercise;
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await (await this.findOne(id)).update(updateExerciseDto);
  }

  remove(id: number) {
    return Exercise.destroy({ where: { id } });
  }
}

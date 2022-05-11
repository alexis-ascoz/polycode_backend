import { Injectable, NotFoundException } from '@nestjs/common';
import { Progress } from 'src/progressions/entities/progress.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  create(createExerciseDto: CreateExerciseDto) {
    return Exercise.build({ ...createExerciseDto }).save();
  }

  async findAllWithUserInfo(user: User) {
    const exercises = await Exercise.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          required: false,
        },
      ],
    });

    return exercises.map((exercise) => ExercisesService.addUserScore(exercise));
  }

  async findOne(id: number) {
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found.`);
    }

    return exercise;
  }

  async findOneWithUserInfo(id: number, user: User) {
    const exercise: any = await Exercise.findOne({
      where: { id },
      include: [
        {
          model: User,
          where: { id: user.id },
          required: false,
        },
      ],
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found.`);
    }

    return ExercisesService.addUserScore(exercise);
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await (await this.findOne(id)).update(updateExerciseDto);
  }

  remove(id: number) {
    return Exercise.destroy({ where: { id } });
  }

  private static addUserScore(exercise: any) {
    let progress: any;

    if (exercise.users[0]) {
      progress = {
        score: exercise.users[0]?.Progress.score,
        code: exercise.users[0]?.Progress.code,
      };
    }

    return {
      id: exercise.id,
      title: exercise.id,
      descritpion: exercise.description,
      instructions: exercise.instructions,
      baseCode: exercise.baseCode,
      codeLanguage: exercise.codeLanguage,
      progress,
    };
  }
}

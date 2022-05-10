import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { ExercisesService } from 'src/exercises/exercises.service';
import { ProgressionsService } from 'src/progressions/progressions.service';
import { RunService } from 'src/run/run.service';
import { User } from 'src/users/entities/user.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { RunExerciseDto } from './dto/run-exercise.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestsService {
  constructor(
    private readonly runService: RunService,
    private readonly exercisesService: ExercisesService,
    private readonly progressionsService: ProgressionsService,
  ) {}

  async create(createTestDto: CreateTestDto) {
    await this.exercisesService.findOne(createTestDto.exerciseId);

    return await Test.build({ ...createTestDto }).save();
  }

  findAllByExerciseWithoutHiddenTests(exerciseId: number) {
    return Test.findAll({ where: { exerciseId, hidden: false } });
  }

  findAllByExercise(exerciseId: number) {
    return Test.findAll({ where: { exerciseId } });
  }

  async findOne(id: number) {
    const test: Test = await Test.findByPk(id);

    if (!test) {
      throw new NotFoundException(`Test with id ${id} not found.`);
    }

    return test;
  }

  async update(id: number, updateTestDto: UpdateTestDto) {
    return await (await this.findOne(id)).update(updateTestDto);
  }

  remove(id: number) {
    return Test.destroy({ where: { id } });
  }

  async run(id: number, runExerciseDto: RunExerciseDto, user: User) {
    const test: Test = await this.findOne(id);

    if (test.hidden) {
      throw new NotFoundException();
    }

    const exercise: Exercise = await this.exercisesService.findOne(
      test.exerciseId,
    );

    const result = await this.runService.run(
      exercise.codeLanguage,
      runExerciseDto.code,
      test.input,
    );

    await this.progressionsService.upsert({
      score: 0,
      code: runExerciseDto.code,
      userId: user.id,
      exerciseId: exercise.id,
    });

    return {
      success: result.stdout === test.output,
      ...result,
      expected: test.output,
    };
  }

  async runAllByExercise(
    exerciseId: number,
    runExerciseDto: RunExerciseDto,
    user: User,
  ) {
    const exercise: Exercise = await this.exercisesService.findOne(exerciseId);

    const tests: Test[] = await this.findAllByExercise(exerciseId);

    let successNumber = 0;

    await Promise.all(
      tests.map(async (test) => {
        const result = await this.runService.run(
          exercise.codeLanguage,
          runExerciseDto.code,
          test.input,
        );

        if (result.stdout === test.output) {
          successNumber++;
        }
      }),
    );

    const score = Math.floor((successNumber / tests.length) * 100);

    await this.progressionsService.upsert({
      score,
      code: runExerciseDto.code,
      userId: user.id,
      exerciseId,
    });

    return {
      score,
      success: successNumber === tests.length,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ExercisesService } from 'src/exercises/exercises.service';
import { UsersService } from 'src/users/users.service';
import { UpsertProgressDto } from './dto/upsert-progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly exercisesService: ExercisesService,
  ) {}

  async upsert(upsertProgressDto: UpsertProgressDto) {
    await this.usersService.findOne(upsertProgressDto.userId);
    await this.exercisesService.findOne(upsertProgressDto.exerciseId);

    const progress = await this.findOne(
      upsertProgressDto.userId,
      upsertProgressDto.exerciseId,
    );

    if (progress) {
      // Update
      return await progress.update(upsertProgressDto);
    } else {
      // Create
      return await Progress.build({ ...upsertProgressDto }).save();
    }
  }

  findOne(userId: number, exerciseId: number) {
    return Progress.findOne({
      where: {
        userId,
        exerciseId,
      },
    });
  }
}

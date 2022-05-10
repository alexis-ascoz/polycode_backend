import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { RunService } from 'src/run/run.service';
import { ExercisesService } from 'src/exercises/exercises.service';
import { ProgressionsService } from 'src/progressions/progressions.service';
import { CryptoService } from 'src/auth/crypto.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [TestsController],
  providers: [
    TestsService,
    RunService,
    ExercisesService,
    ProgressionsService,
    CryptoService,
    UsersService,
  ],
  exports: [TestsService],
})
export class TestsModule {}

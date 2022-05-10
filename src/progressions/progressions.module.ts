import { Module } from '@nestjs/common';
import { CryptoService } from 'src/auth/crypto.service';
import { ExercisesService } from 'src/exercises/exercises.service';
import { UsersService } from 'src/users/users.service';
import { ProgressionsService } from './progressions.service';

@Module({
  providers: [
    ProgressionsService,
    UsersService,
    ExercisesService,
    CryptoService,
  ],
  exports: [ProgressionsService],
})
export class ProgressionsModule {}

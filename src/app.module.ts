import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RunModule } from './run/run.module';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { Token } from './tokens/entities/token.entity';
import { Exercise } from './exercises/entities/exercise.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TokensModule,
    AuthModule,
    ExercisesModule,
    RunModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      models: [User, Token, Exercise],
    }),
  ],
})
export class AppModule {}

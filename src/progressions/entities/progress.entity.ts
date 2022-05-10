import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { User } from 'src/users/entities/user.entity';

@Table
export class Progress extends Model {
  @Column
  score: number;

  @Column(DataType.TEXT)
  code: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Exercise)
  @Column
  exerciseId: number;
}

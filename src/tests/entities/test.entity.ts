import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Exercise } from 'src/exercises/entities/exercise.entity';

@Table
export class Test extends Model {
  @ForeignKey(() => Exercise)
  @Column
  exerciseId: number;

  @BelongsTo(() => Exercise)
  exercise: Exercise;

  @Column
  name: string;

  @Column(DataType.TEXT)
  input: string;

  @Column(DataType.TEXT)
  output: string;

  @Column
  hidden: boolean;
}

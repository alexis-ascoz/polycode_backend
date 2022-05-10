import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CodeLanguage } from 'src/run/run.types';
import { User } from 'src/users/entities/user.entity';

@Table
export class Exercise extends Model {
  @Column
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.TEXT)
  instructions: string;

  @Column(DataType.TEXT)
  baseCode: string;

  @Column(DataType.ENUM('JAVASCRIPT'))
  codeLanguage: CodeLanguage;
}

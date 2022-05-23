import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Progress } from 'src/progressions/entities/progress.entity';
import { Token } from '../../tokens/entities/token.entity';

@Table
export class User extends Model {
  @Column
  verifytoken: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => Token)
  tokens: Token[];

  @BelongsToMany(() => Exercise, () => Progress)
  exercises: Exercise[];
}

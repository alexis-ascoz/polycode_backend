import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Token } from '../../tokens/entities/token.entity';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column
  password: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column({ defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => Token)
  tokens: Token[];
}

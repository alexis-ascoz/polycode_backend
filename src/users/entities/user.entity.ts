import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Token } from '../../tokens/entities/token.entity';

@Table
export class User extends Model {
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
}

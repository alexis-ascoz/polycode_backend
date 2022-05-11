import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { CryptoService } from 'src/auth/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private cryptoService: CryptoService) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfUserDosentViolateUniqueConstraint(0, createUserDto.email);

    const hashedPassword = await this.cryptoService.hashString(
      createUserDto.password,
    );
    return await User.build({
      ...createUserDto,
      password: hashedPassword,
    }).save();
  }

  async findAll() {
    return await User.findAll();
  }

  async findOne(id: number) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exist.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkIfUserDosentViolateUniqueConstraint(
      id,
      updateUserDto.email,
    );

    return await (await this.findOne(id)).update(updateUserDto);
  }

  async remove(id: number) {
    return await User.destroy({ where: { id } });
  }

  async checkIfUserDosentViolateUniqueConstraint(
    id: number,
    email: string,
  ): Promise<any> {
    if (email) {
      const userWithSameEmail = await User.findOne({
        where: {
          id: { [Op.ne]: id },
          email,
        },
      });

      if (userWithSameEmail) {
        throw new ConflictException(
          'This email is already used by another account.',
        );
      }
    }
  }
}

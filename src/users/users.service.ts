import { Injectable, NotFoundException } from '@nestjs/common';
import { CryptoService } from 'src/auth/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private cryptoService: CryptoService) {}

  async create(createUserDto: CreateUserDto) {
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

    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneByUsername(username: string) {
    const user = await User.findOne({ where: { username } });

    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await (await this.findOne(id)).update(updateUserDto);
  }

  async remove(id: number) {
    return await User.destroy({ where: { id } });
  }
}

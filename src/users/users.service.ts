import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
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

    let verifytoken: string = Math.random()
      .toString(36)
      .substring(2, 12 + 2);

    try {
      await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        {
          sender: {
            email: 'no-reply@polycode.fr',
            name: 'no-reply',
          },
          to: [
            {
              email: createUserDto.email,
              name: createUserDto.firstName + ' ' + createUserDto.lastName,
            },
          ],
          subject: 'Account verification',
          htmlContent:
            `<h2>Hello ${createUserDto.firstName} and welcome to polycode !</h2>` +
            '<p>Please click on the link below to verify your account</p>' +
            `<a href="https://api.ascoz.fr/auth/verify/${createUserDto.email}/${verifytoken}">Verify</a>`,
        },
        {
          headers: {
            accept: 'application/json',
            'api-key': process.env.EMAIL_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      verifytoken = null;
      console.log(err?.response?.data ?? err);
    }

    const hashedPassword = await this.cryptoService.hashString(
      createUserDto.password,
    );

    const user = await User.build({
      ...createUserDto,
      password: hashedPassword,
      verifytoken,
    }).save();

    return user;
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

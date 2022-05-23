import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private cryptoService: CryptoService,
    private readonly tokenService: TokensService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user.verifytoken !== null) {
      throw new BadRequestException('User is not verified');
    }

    if (!(await this.cryptoService.compareString(password, user.password))) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUserToken(userId: number) {
    return { token: (await this.tokenService.create(userId)).token };
  }

  async verify(email: string, token: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user.verifytoken == null) {
      throw new BadRequestException('User is already verified');
    }

    if (user.verifytoken !== token) {
      throw new BadRequestException('Bad token!');
    }

    user.verifytoken = null;
    await user.save();

    return { message: 'User is now verified!' };
  }
}

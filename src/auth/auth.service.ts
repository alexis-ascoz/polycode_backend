import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (!(await this.cryptoService.compareString(password, user.password))) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUserToken(userId: number) {
    return { token: (await this.tokenService.create(userId)).token };
  }
}

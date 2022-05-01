import { Injectable } from '@nestjs/common';
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

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (await this.cryptoService.compareString(password, user.password)) {
      return user;
    }

    return null;
  }

  async createUserToken(userId: number) {
    return { token: (await this.tokenService.create(userId)).token };
  }
}

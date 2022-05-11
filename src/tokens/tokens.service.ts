import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  create(userId: number) {
    const token = this.jwtService.sign(
      { id: userId },
      { expiresIn: '10d', secret: process.env.JWT_SECRET },
    );

    const expiresAt = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);

    return Token.create({ token, userId, expiresAt });
  }

  async validateTokenAndReturnUser(token: string): Promise<User> {
    const user = await User.findOne({
      include: [
        {
          model: Token,
          required: true,
          where: { token },
        },
      ],
    });

    if (user) {
      return user;
    } else {
      throw new ForbiddenException();
    }
  }

  async validateTokenAndReturnUserAdmin(token: string): Promise<User> {
    const user = await User.findOne({
      include: [
        {
          model: Token,
          required: true,
          where: { token },
        },
      ],
    });

    if (user?.isAdmin) {
      return user;
    } else {
      throw new ForbiddenException();
    }
  }
}

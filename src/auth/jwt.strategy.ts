import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokenService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request) {
    const tokenWithoutBearer = request.headers.authorization.replace(
      'Bearer ',
      '',
    );

    return await this.tokenService.validateTokenAndReturnUser(
      tokenWithoutBearer,
    );
  }
}

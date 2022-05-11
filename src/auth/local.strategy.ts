import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      return await this.authService.validateUser(email, password);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User or password incorrect!');
      }

      throw error;
    }
  }
}

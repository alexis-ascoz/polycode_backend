import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { CryptoService } from './crypto.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, TokensModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptoService],
  controllers: [AuthController],
})
export class AuthModule {}

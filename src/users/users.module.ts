import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoService } from 'src/auth/crypto.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [SequelizeModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService, CryptoService],
})
export class UsersModule {}

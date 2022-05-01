import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { ReqUser } from 'src/auth/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@ReqUser() user: User) {
    if (user.isAdmin) {
      return this.usersService.findAll();
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @ReqUser() user: User) {
    if (!user.isAdmin && user.id !== +id) {
      throw new ForbiddenException();
    }

    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: User,
  ) {
    if (!user.isAdmin && user.id !== +id) {
      throw new ForbiddenException();
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @ReqUser() user: User) {
    if (!user.isAdmin && user.id !== +id) {
      throw new ForbiddenException();
    }

    return this.usersService.remove(+id);
  }
}

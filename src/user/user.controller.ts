import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';

import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { LogInterceptor } from '../interceptors/log.interceptor';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { ParamId } from '../decorators/param-id.decorator';

// a ordem dos guards é importante, AuthGuard deve ser o primeiro para garantir que o usuário esteja autenticado antes de verificar os roles.
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(LogInterceptor)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @SkipThrottle()
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async list(): Promise<User[]> {
    return this.userService.list();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @ParamId() id: number,
    @Body() { email, name, password }: UpdatePutUserDto,
  ) {
    return this.userService.update(id, { email, name, password });
  }
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() data: UpdatePatchUserDto) {
    return this.userService.updatePartial(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}

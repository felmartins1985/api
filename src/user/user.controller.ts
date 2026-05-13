import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { User } from 'generated/prisma/client';
import { LogInterceptor } from 'src/interceptors/log.interceptor';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(LogInterceptor)
  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Get()
  async list(): Promise<User[]> {
    return this.userService.list();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { email, name, password }: UpdatePutUserDto,
  ) {
    return this.userService.update(id, { email, name, password });
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePatchUserDto,
  ) {
    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

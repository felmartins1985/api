import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create({
    email,
    name,
    password,
    birthAt,
  }: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
    });
  }
  async list(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async show(id: number): Promise<User | null> {
    await this.exists(id);
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDto,
  ) {
    await this.exists(id);
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
    });
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePatchUserDto,
  ) {
    await this.exists(id);
    const data: any = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt);
    }
    if (birthAt) data.birthAt = new Date(birthAt);
    if (role) data.role = role;
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.exists(id);
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return { id };
  }
  async exists(id: number) {
    if (!(await this.prisma.user.count({ where: { id } }))) {
      throw new NotFoundException('User not found');
    }
  }
}

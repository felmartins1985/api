import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async create({ email, name, password, birthAt }: CreateUserDto) {
    if (await this.usersRepository.exists({ where: { email } })) {
      throw new BadRequestException('Este e-mail já está em uso');
    }
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      name,
      password,
      birthAt: birthAt ? new Date(birthAt) : undefined,
    });
    return this.usersRepository.save(user);
  }
  async list(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async show(id: number): Promise<UserEntity | null> {
    await this.exists(id);
    return await this.usersRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDto,
  ) {
    await this.exists(id);
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    await this.usersRepository.update(Number(id), {
      email,
      name,
      password,
      birthAt: birthAt ? new Date(birthAt) : undefined,
      role,
    });
    return this.show(id);
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
    await this.usersRepository.update(Number(id), data);
    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    await this.usersRepository.delete(id);
    return true;
  }
  async exists(id: number) {
    if (!(await this.usersRepository.exists({ where: { id } }))) {
      throw new NotFoundException('User not found');
    }
  }
}

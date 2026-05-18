import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password!: string;

  @IsOptional()
  @IsDateString()
  birthAt?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: number;
}

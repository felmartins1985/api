import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/enums/role.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 63,
  })
  name!: string;
  @Column({
    length: 127,
    unique: true,
  })
  email!: string;
  @Column({
    length: 127,
  })
  password!: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt!: Date;
  @Column({
    type: 'tinyint',
    default: Role.USER,
  })
  role!: number;

  @CreateDateColumn()
  createdAt!: string;
  @UpdateDateColumn()
  updatedAt!: string;
}

import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '$2b$10$WBFK6ibaPkuaa0AWOBfU1u3TibDijzYC66siVq2wzVl4cAAKIKrYO',
    birthAt: new Date('2000-01-01'),
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: '$2b$10$WBFK6ibaPkuaa0AWOBfU1u3TibDijzYC66siVq2wzVl4cAAKIKrYO',
    birthAt: new Date('2000-02-01'),
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: '$2b$10$WBFK6ibaPkuaa0AWOBfU1u3TibDijzYC66siVq2wzVl4cAAKIKrYO',
    birthAt: new Date('2000-03-01'),
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

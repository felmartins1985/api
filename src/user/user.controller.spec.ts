import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import guardMock from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { createUserDto } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { updatePutUserDto } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDto } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });
  test('validar a definição', () => {
    expect(userService).toBeDefined();
    expect(userController).toBeDefined();
  });
  describe('validar os guards', () => {
    test('Se os guards estão sendo aplicados', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);
      expect(guards.length).toBe(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });
  describe('create', () => {
    test('method create', async () => {
      const result = await userController.create(createUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('read', () => {
    test('method list', async () => {
      const result = await userController.list();
      expect(result).toEqual(userEntityList);
    });
    test('method show', async () => {
      const result = await userController.show(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('update', () => {
    test('method update', async () => {
      const result = await userController.update(1, updatePutUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
    test('method update partial', async () => {
      const result = await userController.updatePartial(1, updatePatchUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('delete', () => {
    test('method delete', async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({ success: true });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { accessToken } from '../testing/access-token-mock';
import { jwtPayload } from '../testing/jwt-payload.mock';
import { resetToken } from '../testing/reset-token-mock';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';
describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });
  test('validar a definição', () => {
    expect(authService).toBeDefined();
  });

  describe('token', () => {
    test('method createToken', () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({
        accessToken,
      });
    });
    test('method checkToken', () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });
    test('method isValidToken', () => {
      const result = authService.isValidToken(accessToken);
      expect(result).toBe(true);
    });
  });
  describe('autenticação', () => {
    test('method login', async () => {
      const result = await authService.login('johndoe@example.com', 'A@134a');
      expect(result).toEqual({ accessToken });
    });
    test('method forget', async () => {
      const result = await authService.forget('johndoe@example.com');
      expect(result).toBe(true);
    });
    test('method reset', async () => {
      const result = await authService.reset('A@134b', resetToken);
      expect(result).toEqual({ accessToken });
    });
    test('method register', async () => {
      const result = await authService.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});

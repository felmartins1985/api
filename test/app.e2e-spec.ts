import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { authRegisterDTO } from '../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('registrar um novo usuario', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTO);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });
  it('tentar fazer login com o novo usuario', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTO.email,
        password: authRegisterDTO.password,
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
    accessToken = response.body.accessToken;
  });
  it('obter os dados do usuario logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.role).toEqual(String(Role.USER));
    userId = response.body.id;
  });
  it('registrar um novo usuario como administrador', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDTO,
        role: Role.ADMIN,
        email: 'admin@example.com',
      });
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toBe('string');
    accessToken = response.body.accessToken;
  });
  it('Validar se a função do novo usuario ainda é user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.role).toEqual(String(Role.USER));
    userId = response.body.id;
  });
  it('tentar ver a lista de todos os usuarios', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });
  it('alterando manualmente o usuario para a funcao administrador', async () => {
    const data = await dataSource.initialize();
    const queryRunner = data.createQueryRunner();
    await queryRunner.query(
      `UPDATE users SET role = ${Role.ADMIN} WHERE id = '${userId}'`,
    );
    const rows = await queryRunner.query(
      `SELECT * FROM users WHERE id = '${userId}'`,
    );
    console.log('rows=========>', rows);
    await data.destroy();
    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(String(Role.ADMIN));
  });
  it('tentar ver a lista de todos os usuarios, agora com acesso', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });
});

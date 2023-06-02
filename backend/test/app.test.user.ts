import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';
import { UserService } from '../src/service/user.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserRole } from '../src/entity/user.entity';

describe('AppController (user)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get(getDataSourceToken());
    await connection.synchronize(true);

    userService = moduleFixture.get(UserService);
    await userService.create({
      name: 'Test User',
      email: 'test@example.com',
      id: 1,
      cars: [],
      role: UserRole.PARTICULIER,
      password: '1234',
    });
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'New User', email: 'new@example.com', password: '1234' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual('New User');
        expect(response.body.email).toEqual('new@example.com');
        expect(response.body.password).toEqual('1234');
      });
  });

  it('/users/log (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/log')
      .query({ email: 'test@example.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.PARTICULIER,
        password: '1234',
      });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .expect({ message: 'User deleted' });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: UserRole.PARTICULIER,
          password: '1234',
        },
      ]);
  });

  afterEach(async () => {
    const connection = app.get(getDataSourceToken());
    await connection.close();
    await app.close();
  });
});

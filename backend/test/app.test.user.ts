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

  // Create a test module
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get(getDataSourceToken());
    await connection.synchronize(true);

    // Create a user
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

  // Test adding a user
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'New User', email: 'new@example.com', password: '1234' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toEqual({
          id: response.body.id,
          name: 'New User',
          email: 'new@example.com',
          role: UserRole.PARTICULIER,
        });
      });
  });

  // Test logging a user
  it('/users/log (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/log')
      .query({ email: 'test@example.com', password: '1234' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.PARTICULIER,
      });
  });

  // Test deleting a user
  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .expect({ message: 'User deleted' });
  });

  // Test getting all users
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
        },
      ]);
  });

  // Test getting a user with id
  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.PARTICULIER,
      });
  });

  // Test getting a non existing user
  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/3')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        message: 'User not found',
        code: 404,
      });
  });

  // Test logging a user wrong password
  it('/users/log (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/log')
      .query({ email: 'test@example.com', password: 'wrong' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        message: 'User not found',
        code: 404,
      });
  });

  // Test logging a user wrong email
  it('/users/log (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/log')
      .query({ email: 'wrong', password: '1234' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        message: 'User not found',
        code: 404,
      });
  });

  // Test deleting a non existing user
  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/3')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ message: 'User not found' });
  });

  afterEach(async () => {
    const connection = app.get(getDataSourceToken());
    await connection.close();
    await app.close();
  });
});

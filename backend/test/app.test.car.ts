import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';
import { CarService } from '../src/service/car.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from '../src/service/user.service';
import { UserRole } from '../src/entity/user.entity';

describe('AppController (car)', () => {
  let app: INestApplication;
  let carService: CarService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get(getDataSourceToken());
    await connection.synchronize(true);

    carService = moduleFixture.get(CarService);

    // Create a car
    let car = await carService.add({
      id: 1,
      make: 'Test Make',
      model: 'Test Model',
      city: 'Papeete',
      year: 2004,
      pricePerDay: 30,
      bookings: [],
      owner: null,
      imageUrl:
        'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
    });

    // Create a user
    userService = moduleFixture.get(UserService);
    await userService.create({
      name: 'Test User',
      email: 'test@example.com',
      id: 1,
      cars: [car],
      role: UserRole.PARTICULIER,
      password: '1234',
    });
  });

  // Test adding a car
  it('/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send({
        make: 'New Make',
        model: 'New Model',
        city: 'Papeete',
        year: 2023,
        pricePerDay: 30,
        imageUrl:
          'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toEqual({
          id: response.body.id,
          make: 'New Make',
          model: 'New Model',
          city: 'Papeete',
          year: 2023,
          pricePerDay: 30,
          imageUrl:
            'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
        });
      });
  });

  // Test getting a car with id
  it('/cars/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        id: 1,
        make: 'Test Make',
        model: 'Test Model',
        city: 'Papeete',
        year: 2004,
        pricePerDay: 30,
        imageUrl:
          'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
      });
  });

  // Test deleting a car with id
  it('/cars/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/cars/1')
      .expect(200)
      .expect({ message: 'Car deleted' });
  });

  // Test getting all cars
  it('/cars (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([
        {
          id: 1,
          make: 'Test Make',
          model: 'Test Model',
          year: 2004,
          city: 'Papeete',
          pricePerDay: 30,
          imageUrl:
            'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
        },
      ]);
  });

  // Test getting all cars of a user
  it('/cars/usr/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars/usr/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([
        {
          id: 1,
          make: 'Test Make',
          model: 'Test Model',
          city: 'Papeete',
          year: 2004,
          pricePerDay: 30,
          imageUrl:
            'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
        },
      ]);
  });

  // Test updating a car with id
  it('/cars/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/cars/1')
      .send({
        make: 'Updated Make',
        model: 'Updated Model',
        city: 'Papeete',
        year: 2023,
        pricePerDay: 30,
        imageUrl:
          'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toEqual({
          id: 1,
          make: 'Updated Make',
          model: 'Updated Model',
          city: 'Papeete',
          year: 2023,
          pricePerDay: 30,
          imageUrl:
            'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
        });
      });
  });

  // Test getting an unexisting car
  it('/cars/:id (GET) 404', () => {
    return request(app.getHttpServer()).get('/cars/2').expect(200).expect({
      statusCode: 404,
      message: 'Car not found',
    });
  });

  afterEach(async () => {
    const connection = app.get(getDataSourceToken());
    await connection.close();
    await app.close();
  });
});

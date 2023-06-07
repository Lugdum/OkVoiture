import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';
import { BookingService } from '../src/service/booking.service';
import { UserService } from '../src/service/user.service';
import { CarService } from '../src/service/car.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserRole } from '../src/entity/user.entity';

describe('AppController (booking)', () => {
  let app: INestApplication;
  let bookingService: BookingService;
  let userService: UserService;
  let carService: CarService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get(getDataSourceToken());
    await connection.synchronize(true);

    userService = moduleFixture.get(UserService);
    carService = moduleFixture.get(CarService);
    bookingService = moduleFixture.get(BookingService);

    // Add a user
    const owner = await userService.create({
      name: 'Test Owner',
      email: 'owner@example.com',
      id: 1,
      cars: [],
      role: UserRole.LOUEUR,
      password: '1234',
    });

    // Add a car
    const car = await carService.add({
      id: 1,
      make: 'Test Make',
      model: 'Test Model',
      year: 2004,
      pricePerDay: 30,
      city: 'Papeete',
      bookings: [],
      owner: owner,
      imageUrl:
        'https://m.media-amazon.com/images/I/71g4V88VQZL._AC_SL1500_.jpg',
    });

    // Add a user with the car
    const user = await userService.create({
      name: 'Test User',
      email: 'user@example.com',
      id: 1,
      cars: [car],
      role: UserRole.PARTICULIER,
      password: '1234',
    });

    // Add a booking with the user and the car
    await bookingService.add({
      startDate: new Date('2023-05-30'),
      endDate: new Date('2023-06-30'),
      user: user,
      car: car,
      id: 1,
    });
  });

  // Test adding a booking
  it('/bookings (POST)', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .send({
        startDate: '2023-05-30',
        endDate: '2023-06-30',
        userId: 1,
        carId: 1,
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toEqual({
          id: response.body.id,
          startDate: '2023-05-30',
          endDate: '2023-06-30',
          userId: 1,
          carId: 1,
        });
      });
  });

  // Test getting a booking with id
  it('/bookings/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id', 1);
        expect(
          new Date(response.body.startDate).toISOString().split('T')[0],
        ).toEqual('2023-05-30');
        expect(
          new Date(response.body.endDate).toISOString().split('T')[0],
        ).toEqual('2023-06-30');
        expect(response.body.user.id).toEqual(1);
        expect(response.body.car.id).toEqual(1);
      });
  });

  // Test deleting a booking
  it('/bookings/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/bookings/1')
      .expect(200)
      .expect({ message: 'Booking deleted' });
  });

  // Test getting all bookings
  it('/bookings (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id', 1);
        expect(
          new Date(response.body[0].startDate).toISOString().split('T')[0],
        ).toEqual('2023-05-30');
        expect(
          new Date(response.body[0].endDate).toISOString().split('T')[0],
        ).toEqual('2023-06-30');
        expect(response.body[0].user.id).toEqual(1);
        expect(response.body[0].car.id).toEqual(1);
      });
  });

  // Test getting all bookings per user
  it('/bookings/usr/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings/usr/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body[0]).toEqual({
          id: 1,
          startDate: '2023-05-30',
          endDate: '2023-06-30',
          car: { id: 1 },
          user: response.body[0].user,
        });
      });
  });

  // Test getting all bookings per car
  it('/bookings/car/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings/car/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body[0]).toEqual({
          id: 1,
          startDate: '2023-05-30',
          endDate: '2023-06-30',
        });
      });
  });

  // Test finding available bookings
  it('/bookings/available/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings/available/1')
      .query({ startDate: '2023-07-01', endDate: '2023-07-31' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveLength(0);
      });
  });

  // Test updating a booking
  it('/bookings/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/bookings/1')
      .send({
        startDate: '2023-05-30',
        endDate: '2023-07-30',
        userId: 1,
        carId: 1,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toEqual({
          id: 1,
          startDate: '2023-05-30',
          endDate: '2023-07-30',
          user: response.body.user,
          car: response.body.car,
          carId: 1,
          userId: 1,
        });
      });
  });

  afterEach(async () => {
    const connection = app.get(getDataSourceToken());
    await connection.close();
    await app.close();
  });
});

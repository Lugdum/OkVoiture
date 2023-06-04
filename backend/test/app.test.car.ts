import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';
import { CarService } from '../src/service/car.service';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('AppController (car)', () => {
  let app: INestApplication;
  let carService: CarService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get(getDataSourceToken());
    await connection.synchronize(true);

    carService = moduleFixture.get(CarService);
    await carService.add({
      id: 1,
      make: 'Test Make',
      model: 'Test Model',
      city: 'Papeete',
      year: 2004,
      pricePerDay: 30,
      bookings: [],
      owner: null,
      imageUrl: null,
    });
  });

  it('/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send({
        make: 'New Make',
        model: 'New Model',
        city: 'Papeete',
        year: 2023,
        pricePerDay: 30,
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.make).toEqual('New Make');
        expect(response.body.model).toEqual('New Model');
        expect(response.body.city).toEqual('Papeete');
        expect(response.body.year).toEqual(2023);
      });
  });

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
        imageUrl: null,
      });
  });

  it('/cars/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/cars/1')
      .expect(200)
      .expect({ message: 'Car deleted' });
  });

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
          imageUrl: null,
        },
      ]);
  });

  afterEach(async () => {
    const connection = app.get(getDataSourceToken());
    await connection.close();
    await app.close();
  });
});

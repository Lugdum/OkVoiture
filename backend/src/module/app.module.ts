import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car.module';
import { UserModule } from './user.module';
import { BookingModule } from './booking.module';
import { BookingEntity } from '../entity/booking.entity';
import { CarEntity } from '../entity/car.entity';
import { UserEntity } from '../entity/user.entity';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_DATABASE
          : process.env.DB_DATABASE,
      entities: [BookingEntity, CarEntity, UserEntity],
      synchronize: false,
    }),
    CarModule,
    UserModule,
    BookingModule,
  ],
})
export class AppModule {}

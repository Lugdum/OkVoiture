import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car.module';
import { UserModule } from './user.module';
import { BookingModule } from './booking.module';
import { BookingEntity } from '../entity/booking.entity';
import { CarEntity } from '../entity/car.entity';
import { UserEntity } from '../entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'okvoiture',
      entities: [BookingEntity, CarEntity, UserEntity],
      synchronize: true,
    }),
    CarModule,
    UserModule,
    BookingModule,
  ],
})
export class AppModule {}

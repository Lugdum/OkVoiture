import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from '../service/booking.service';
import { BookingController } from '../controller/booking.controller';
import { BookingEntity } from '../entity/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}

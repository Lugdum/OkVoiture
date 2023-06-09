import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { BookingEntity } from '../entity/booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('usr/:id')
  async findAllPerUsr(@Param('id') id: number) {
    return await this.bookingService.findAllPerUser(id);
  }

  @Get('car/:id')
  findAllPerCar(@Param('id') id: number) {
    return this.bookingService.findAllPerCar(id);
  }

  @Get('available/:id')
  async findAvailabe(
    @Param('id') id: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.bookingService.findAvailabe(
      id,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const booking = await this.bookingService.findOne(id);
    return booking;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Post()
  create(@Body() booking: BookingEntity) {
    return this.bookingService.add(booking);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() booking: BookingEntity) {
    return this.bookingService.update(id, booking);
  }
}

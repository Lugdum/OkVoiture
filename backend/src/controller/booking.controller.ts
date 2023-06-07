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
    let booking = await this.bookingService.findAllPerUser(id);
    let bookingNoPwd = booking.map((b) => {
      delete b.user.password;
      return b;
    });
    return bookingNoPwd;
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
    let booking = await this.bookingService.findAvailabe(
      id,
      startDate,
      endDate,
    );
    return booking.map((b) => {
      delete b.user.password;
      return b;
    });
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

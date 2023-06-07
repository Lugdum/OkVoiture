import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../entity/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingsRepository: Repository<BookingEntity>,
  ) {}

  findAll(): Promise<BookingEntity[]> {
    return this.bookingsRepository.find();
  }

  findAllPerUser(userId: number): Promise<BookingEntity[]> {
    return this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoin('booking.car', 'car')
      .addSelect('car.id')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.userId = :userId', { userId })
      .getMany();
  }

  findAllPerCar(carId: number): Promise<BookingEntity[]> {
    return this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .getMany();
  }

  findAvailabe(
    carId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingEntity[]> {
    return this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.carId = :carId', { carId })
      .andWhere('booking.startDate <= :endDate', { endDate })
      .andWhere('booking.endDate >= :startDate', { startDate })
      .getMany();
  }

  async findOne(id: number): Promise<BookingEntity> {
    return this.bookingsRepository.findOne({
      where: { id: id },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    let a = await this.bookingsRepository.delete(id);
    return { message: 'Booking deleted' };
  }

  async add(booking: BookingEntity): Promise<BookingEntity> {
    return await this.bookingsRepository.save(booking);
  }

  async update(id: number, bookingData: BookingEntity): Promise<BookingEntity> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: id },
    });

    if (!booking)
      console.error("Booking not found mais ca devrait pas arriver j'espere");
    return this.bookingsRepository.save({ ...booking, ...bookingData });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarEntity } from '../entity/car.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private carsRepository: Repository<CarEntity>,
  ) {}

  findAll(): Promise<CarEntity[]> {
    return this.carsRepository.find();
  }

  findAllPerUser(userId: number): Promise<CarEntity[]> {
    return this.carsRepository
      .createQueryBuilder('car')
      .where('car.ownerId = :userId', { userId })
      .getMany();
  }

  findOne(id: number): Promise<CarEntity> {
    return this.carsRepository.findOne({
      where: { id: id },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    let a = await this.carsRepository.delete(id);
    return { message: 'Car deleted' };
  }

  async add(car: CarEntity): Promise<CarEntity> {
    return await this.carsRepository.save(car);
  }

  async update(id: number, car: CarEntity): Promise<CarEntity> {
    await this.carsRepository.update(id, car);
    return this.carsRepository.findOne({
      where: { id: id },
    });
  }
}

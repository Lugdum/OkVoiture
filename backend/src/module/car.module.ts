import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarService } from '../service/car.service';
import { CarController } from '../controller/car.controller';
import { CarEntity } from '../entity/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  providers: [CarService],
  controllers: [CarController],
  exports: [CarService],
})
export class CarModule {}
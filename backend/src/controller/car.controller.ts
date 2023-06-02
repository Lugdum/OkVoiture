import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { CarService } from '../service/car.service';
import { CarEntity } from '../entity/car.entity';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get('usr/:id')
  findAllPerUsr(@Param('id') id: number) {
    return this.carService.findAllPerUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.carService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }

  @Post()
  create(@Body() car: CarEntity) {
    return this.carService.add(car);
  }
}
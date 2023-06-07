import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Put,
} from '@nestjs/common';
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
  async findOne(@Param('id') id: number) {
    let car = await this.carService.findOne(id);
    if (!car)
      return {
        statusCode: 404,
        message: 'Car not found',
      };
    return car;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    let car = await this.carService.findOne(id);
    if (!car)
      return {
        statusCode: 404,
        message: 'Car not found',
      };
    return this.carService.remove(id);
  }

  @Post()
  create(@Body() car: CarEntity) {
    return this.carService.add(car);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() car: CarEntity) {
    return this.carService.update(id, car);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BookingEntity } from '../entity/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Citroen', description: 'The make of the car' })
  @Column()
  make: string;

  @ApiProperty({ example: 'C3', description: 'The model of the car' })
  @Column()
  model: string;

  @ApiProperty({ example: 2004, description: 'The year of the car' })
  @Column()
  year: number;

  @ApiProperty({ example: 'Papeete', description: 'The city of the car' })
  @Column()
  city: string;

  @ApiProperty({ example: 30, description: 'The price per day of the car' })
  @Column()
  pricePerDay: number;

  @ApiProperty({
    example: 'https://www.largus.fr/images/images/ORPHEA_105286_1.jpg',
    description: 'The URL of the car image',
  })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({
    type: () => UserEntity,
    description: 'The owner of the car (join)',
  })
  @ManyToOne(() => UserEntity, (user) => user.cars)
  owner: UserEntity;

  @ApiProperty({
    type: () => [BookingEntity],
    description: 'The booking of the car (join)',
  })
  @OneToMany(() => BookingEntity, (booking) => booking.car, { cascade: true })
  bookings: BookingEntity[];
}

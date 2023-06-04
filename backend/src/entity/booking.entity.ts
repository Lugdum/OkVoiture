import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CarEntity } from '../entity/car.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2023-05-30',
    description: 'Start date of the booking',
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    example: '2023-06-30',
    description: 'End date of the booking',
  })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({
    type: () => UserEntity,
    description: 'The user who booked the car (join)',
  })
  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @ApiProperty({
    type: () => CarEntity,
    description: 'The car of the booking (join)',
  })
  @ManyToOne(() => CarEntity, { eager: true })
  car: CarEntity;
}

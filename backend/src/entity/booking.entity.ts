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

  @ApiProperty({ example: 50, description: 'Price per day of the booking' })
  @Column()
  pricePerDay: number;

  @ApiProperty({ example: 'Papeete', description: 'City of the booking' })
  @Column()
  city: string;

  @ApiProperty({
    type: () => UserEntity,
    description: 'The user of the booking (join)',
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

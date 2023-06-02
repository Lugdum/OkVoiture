import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import { CarEntity } from '../entity/car.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    ADMIN = "admin",
    LOUEUR = "loueur",
    PARTICULIER = "particulier"
}

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: "victor.buthod@epita.fr", description: "The email of the user" })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: "Victor", description: "The name of the user" })
    @Column()
    name: string;

    @ApiProperty({ example: "1234", description: "The password of the user" })
    @Column()
    password: string;

    @ApiProperty({ example: UserRole.PARTICULIER, description: "The role of the user" })
    @Column({type: 'enum', enum: UserRole, default: UserRole.PARTICULIER})
    role: UserRole;

    @ApiProperty({ type: () => [CarEntity], description: "The cars of the user (join)" })
    @OneToMany(() => CarEntity, car => car.owner)
    cars: CarEntity[];
}
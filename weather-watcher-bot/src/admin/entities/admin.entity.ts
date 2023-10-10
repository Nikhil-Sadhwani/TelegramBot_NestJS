import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: '6274320085:AAHldNy9i31uRxvf6WhKp0tz6eYjlXp-tfA' })
  apikey: string;

  constructor(details: Partial<Admin>) {
    Object.assign(this, details);
  }
}

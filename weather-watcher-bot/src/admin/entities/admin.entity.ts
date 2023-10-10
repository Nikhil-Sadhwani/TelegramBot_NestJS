import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'admin@gmail.com' })
  email: string;

  @Column({ default: '6376084318:AAE26LB6kpGXlthXBOVA092jexMWFl7E-wA' })
  apikey: string;

  constructor(details: Partial<Admin>) {
    Object.assign(this, details);
  }
}

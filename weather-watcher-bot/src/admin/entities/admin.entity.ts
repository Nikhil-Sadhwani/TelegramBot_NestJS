import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'admin@gmail.com' })
  email: string;

  @Column({ default: process.env.BOT_TOKEN })
  apikey: string;

  constructor(details: Partial<Admin>) {
    Object.assign(this, details);
  }
}

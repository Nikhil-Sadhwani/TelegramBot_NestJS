import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: string;

  @Column()
  city: string;

  @Column({ default: 'subscribe' })
  status: string;

  constructor(details: Partial<User>) {
    Object.assign(this, details);
  }
}

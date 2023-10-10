import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(chat_id: string) {
    return this.usersRepository.findOneBy({ chat_id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existUser = await this.usersRepository.findOneBy({ id });
    existUser.city = updateUserDto.city;
    existUser.status = updateUserDto.status;
    await this.usersRepository.save(existUser);
    return `User ${updateUserDto.status} successfully`;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return `User Deleted successfully`;
  }
}

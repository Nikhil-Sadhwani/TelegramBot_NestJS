import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = new Admin(createAdminDto);
    await this.adminRepository.save(newAdmin);
  }

  async findOne(id: number) {
    return this.adminRepository.findOneBy({ id });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const existAdmin = await this.adminRepository.findOneBy({ id });
    existAdmin.email = updateAdminDto.email;
    existAdmin.apikey = updateAdminDto.apikey;
    await this.adminRepository.save(existAdmin);
    return `API key is changed successfully`;
  }
}

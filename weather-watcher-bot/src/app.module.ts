import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { usersProviders } from './users/users.providers';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { adminProviders } from './admin/admin.providers';
import { AdminController } from './admin/admin.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),TelegramModule, DatabaseModule, UsersModule, AdminModule],
  controllers: [AppController, UsersController, AdminController],
  providers: [
    AppService,
    TelegramService,
    UsersService,
    ...usersProviders,
    AdminService,
    ...adminProviders,
  ],
})
export class AppModule {}

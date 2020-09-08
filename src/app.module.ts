
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MassiveModule } from '@nestjsplus/massive';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    MassiveModule.register({
      user: 'api_user',
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      port: 5432,
      database: 'urls_api',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','..','build'),
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}

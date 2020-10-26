
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
      user: process.env.POSTGRES_USERNAME || 'api_user',
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
     // database: 'urls_api',
     database: 'ddojqlh9g1t5kv'
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

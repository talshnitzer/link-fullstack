import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service'


@Module({
  controllers: [AuthController],
  imports: [PassportModule, UsersModule],
  providers: [JwtStrategy, AuthService, UsersService ]
})
export class AuthModule {}

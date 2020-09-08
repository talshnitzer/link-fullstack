import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
 export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(private authService: AuthService) {
         super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
             secretOrKey: process.env.JWT_SECRET
         });
     }
   
    async validate(payload: any, done: VerifiedCallback) {
        console.log('jwtStrategy validate, payload', payload);
        
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(
                new HttpException('Unauthorized access',
                HttpStatus.UNAUTHORIZED),
                false
            )
        }
        return done(null, user, payload.iat)
    }
}
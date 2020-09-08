import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service' ;

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/login')
    async loginUser(
        @Body('email') email: string
        ) {
         const login = await this.authService.loginUser(email)
         console.log('^^^^^^ login const from controller login func^^^^^^', login);
         
         return login;
    }

    @Get('/account/:token')
    verifyUser(
        @Param('token') token: string
     ) {
        console.log('account/login token: ', token);
        
        return this.authService.verifyUser(token)
        }
    

}

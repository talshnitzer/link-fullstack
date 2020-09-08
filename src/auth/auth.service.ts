import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { sign, verify } from 'jsonwebtoken';
const nodemailer = require("nodemailer");


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService
        ) {}

        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER, // generated ethereal user
              pass: process.env.EMAIL_PASSWORD // generated ethereal password
            }
          });

        

    async sendEmail(email: string, verifyLink: string ) {
        
        let mailOptions = {
            from: '"LinkLink" <' + process.env.EMAIL_USER + '>', 
            to: email, // list of receivers (separated by ,)
            subject: 'Welcome to Itamar\'s Link App', 
            text: 'Verify Email', 
            html: 'Hi! <br><br> Thanks for your registration<br><br>'+
            `<a href=${verifyLink}>Click here to activate your account</a>`  // html body
          };

          await this.transporter.sendMail(mailOptions); 
        return {verifyLink};
    }
    
    async signPayload(payload: any , expiresIn: string) {
        console.log('signPayload%%%%% payload, expiresIn: ', payload, expiresIn);
        
        return sign({payload}, process.env.JWT_SECRET, {expiresIn} )
    }

    async validateUser(payload: any) {
        console.log('####enter validateUser , payload:', payload);
        
        const user = await this.userService.findByPayload(payload);
        console.log('####enter validateUser , user:', user);
        return user ;
    }

    async loginUser(email: string) {
        //find user by email (UserService)
        const user = await this.userService.findUserByEmail(email);
        console.log('loginUser&&&& user: ', user);
        
        //if no user, create user (userService) and generate token (passport)
        if (!user) {
            await this.userService.addUser(email);
            console.log('loginUser&&&&& user added');
        }
        //if user found generate token
        const token = await this.signPayload(email,  '12h'); 
        console.log('loginUser&&&& token: ', token);
         
        //create verification link from token
        
        const link = `${process.env.HOST}/auth/account/${token}`
        console.log('loginUser   &&&& link:  ', link);

        //send email with link (nodemailer)
        try {
        const response =  await this.sendEmail(email, link);
        console.log('loginUser   &&&& response:  ', response);
        
        return {...response, token};
        } catch (e) {
            return {error: e.message}
        }
        
    }

    verifyToken(token: string) {
        try{
            return verify(token, process.env.JWT_SECRET);
        } catch (e) {
            console.log('verify token error: ',e);
        }
    }

    async verifyUser(token: string) {
        //decode token and extract the user's email
        const payload = this.verifyToken(token);
        console.log('verifyUser, payload:', payload);
        
        //find the user by email and update its email.verified to true 
        const user = await this.userService.findByPayload(payload);
        console.log('verifyUser, user', user);
        
        //if user not found return an error
        if (!user) {
            throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN)
        } else {
            //set user valid, generate new token with long expiration
            const token = this.signPayload(user,  '7d'); 
            //send the new token in response
            return token;
        }   
    }
}

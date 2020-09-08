import { Inject, Injectable } from '@nestjs/common';
import { MASSIVE_CONNECTION } from '@nestjsplus/massive';

@Injectable()
export class UsersService {
    constructor(
        @Inject(MASSIVE_CONNECTION) private readonly db
      ) {}

    async findByPayload(payload: any) {
        const { payload: email0 } = payload;
        console.log('findByPayload email0:', email0);
        const email = email0.email? email0.email : email0;
        console.log('findByPayload email:', email);
        
        return await this.db.users.findOne({email});
    }

    async findUserByEmail(email: string) {
        return await this.db.users.findOne({email});
    }

    async addUser(email: string) {
        const user = {
            email,
            created_at: new Date
        }
        console.log('@@@@@ assUser @@@@@, user: ', user);
        
        this.db.users.save(user);
    }
}

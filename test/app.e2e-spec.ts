require('dotenv').config()
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService} from './../src/app.service';
import { contents, token, users } from './seed' ;



describe('AppController (e2e)', () => {
  let app;
  let appService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    //getting the AppService module
    appService = moduleFixture.get<AppService>(AppService);
    await appService.db.my_content.destroy();
    await appService.db.users.destroy();
    //console.log('^^^^^^ deleted ^^^^^', deleted);
    await appService.db.my_content.insert(contents);
    const inserted = await appService.db.users.insert(users);
    //console.log('^^^^^ inserted ^^^^^', inserted);
    

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register user and send link', (done) => {
    const email = 'test.auth@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({email})
      .expect(201)
      .expect((res) => {
        expect(res.body).toBe(/\/auth\/account/)
      })
      .end( async () => {
        const usersTable = await appService.db.users.find({});
        expect(usersTable.length).toBe(4);
        expect(usersTable[3].email).toBe(email);
        done();
      });
  });

  it('should validate user and respond with correct token', (done) => {
    //TODO - await /auth/account/ request and send its response in auth header
    return request(app.getHttpServer())
      .get(`/auth/account/${token[0]}`)
      .expect(200)
      .expect((res) => {
        expect(typeof res.text).toBe('string')
      })
      .end(done)
      
      
  });

  it('should add link', (done) => {
    const content = 'text from e2e test';
    return request(app.getHttpServer())
      .post('/link.json')
      .set('Authorization', `Bearer ${token[0]}`)
      .send({content})
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('url')
      })
      .end(async () => {
        const table = await appService.db.my_content.find({});
        expect(table.length).toBe(4);
        expect(table[3].content).toBe(content);
        expect(table[3].mime_type).toBe('text/plain')
        //console.log('%%%%%% table %%%%%', table);
        done()
      });  
  });

  it('should add link - javascript content', (done) => {
    const content = `
    function $initHighlight(block, cls) {
     try {
       if (cls.search(/\bno\-highlight\b/) != -1)
         return process(block, true, 0x0F) +
                \` class="\${cls}"\`;
     } catch (e) {
       /* handle exception */
     }
     for (var i = 0 / 2; i < classes.length; i++) {
       if (checkCondition(classes[i]) === undefined)
         console.log('undefined');
     }
   
     return (
       <div>
         <web-component>{block}</web-component>
       </div>
     )
   }
   
   export  $initHighlight;
    ` ;
    return request(app.getHttpServer())
      .post('/link.json')
      .set('Authorization', `Bearer ${token[0]}`)
      .send({content})
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('url')
      })
      .end(async () => {
        const table = await appService.db.my_content.find({});
        expect(table.length).toBe(4);
        expect(table[3].content).toBe(content);
        expect(table[3].mime_type).toBe('application/javascript')
        //console.log('%%%%%% table %%%%%', table);
        done()
      });
  
});


  it('should Get content and matching content type - text', (done) => {
    return request(app.getHttpServer())
    .get('/link/text0')
    .expect('Content-Type', /text\/plain/)
    .expect(200, done)
    
  });

  it('should Get content and matching content type - javascript', (done) => {
    return request(app.getHttpServer())
    .get('/link/js123')
    .expect('Content-Type', /application\/javascript/)
    .expect(200, done)
  });

  afterAll(async () => {
    await app.close();
  });
});

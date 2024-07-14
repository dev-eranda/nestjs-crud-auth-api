import { Test } from '@Nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateMealsDto, EditMealsDto } from 'src/meals/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleandb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'eranda@gmail.com',
      password: '123',
    };

    describe('Signup', () => {
      it('shoud throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('shoud throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('shoud throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('shoud throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('shoud throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('shoud throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get profile', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);
        // .inspect()
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        // email: 'eranda1@gmail.com',
        firstName: 'eranda',
        // lastName: 'samarasinghe'
      };
      it('should edit user', () => {
        return (
          pactum
            .spec()
            .patch('/user/edit')
            .withHeaders({
              Authorization: 'Bearer $S{userToken}',
            })
            .withBody(dto)
            .expectStatus(200)
            // .expectBodyContains(dto.email)
            .expectBodyContains(dto.firstName)
        );
        // .expectBodyContains(dto.lastName)
      });
    });
  });

  describe('Meals', () => {
    describe('Get empty meals', () => {
      it('should get empty meals', () => {
        return pactum
          .spec()
          .get('/meals')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Meals', () => {
      const dto: CreateMealsDto = {
        title: 'Pizza',
        description: 'From Pizzahut',
        link: 'https://www.pizzahut.lk/',
      };

      it('should create meal', () => {
        return pactum
          .spec()
          .post('/meals/create')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('mealId', 'id');
      });
    });

    describe('Get meals', () => {
      it('should get meals', () => {
        return pactum
          .spec()
          .get('/meals')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get meals by id', () => {
      it('should get meals by id', () => {
        return pactum
          .spec()
          .get('/meals/{id}')
          .withPathParams('id', '$S{mealId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{mealId}');
      });
    });

    describe('Edit meals by id', () => {
      const dto: EditMealsDto = {
        title: 'dominos',
        description: 'dominos Pizza',
      };
      it('should edit meals by id', () => {
        return pactum
          .spec()
          .patch('/meals/{id}')
          .withPathParams('id', '$S{mealId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .withBody(dto)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete meals by id', () => {
      it('should delete meals by id', () => {
        return pactum
          .spec()
          .delete('/meals/{id}')
          .withPathParams('id', '$S{mealId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(204);
      });

      it('should get empty meals', () => {
        return pactum
          .spec()
          .get('/meals')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Authentication', () => {
        it('/api/auth/register (POST) - should register a new user', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    email: 'e2e@example.com',
                    username: 'e2euser',
                    password: 'Password123!',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('user');
                    expect(res.body).toHaveProperty('accessToken');
                });
        });

        it('/api/auth/login (POST) - should login user', () => {
            return request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'e2e@example.com',
                    password: 'Password123!',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('accessToken');
                });
        });
    });

    describe('Posts', () => {
        let accessToken: string;

        beforeAll(async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'e2e@example.com',
                    password: 'Password123!',
                });
            accessToken = response.body.accessToken;
        });

        it('/api/posts (GET) - should get all posts', () => {
            return request(app.getHttpServer()).get('/api/posts').expect(200);
        });

        it('/api/posts (POST) - should create a post with auth', () => {
            return request(app.getHttpServer())
                .post('/api/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'E2E Test Post',
                    content: 'This is a test post',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.title).toBe('E2E Test Post');
                });
        });

        it('/api/posts (POST) - should fail without auth', () => {
            return request(app.getHttpServer())
                .post('/api/posts')
                .send({
                    title: 'Test Post',
                    content: 'Content',
                })
                .expect(401);
        });
    });
});

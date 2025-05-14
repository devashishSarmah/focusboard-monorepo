import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('/tasks (POST → GET)', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'E2E Unit' })
      .expect(201);
    const res = await request(app.getHttpServer()).get('/tasks');
    expect(res.body).toEqual(expect.arrayContaining([{ title: 'E2E Unit' }]));
  });

  afterAll(() => app.close());
});

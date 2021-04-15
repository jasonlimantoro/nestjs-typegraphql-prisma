import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mockPrismaClient from './utils/mockPrismaClient';
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  };
});
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/graphql (GET)', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `query {
          posts {
            id
            title
            authorId
          }
        }`,
    });
    expect(response.body.data.posts).toEqual(
      await mockPrismaClient.post.findMany(),
    );
    expect(mockPrismaClient.post.findMany).toBeCalled();
  });
});

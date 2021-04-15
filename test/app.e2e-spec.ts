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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('QUERY: posts', async () => {
    mockPrismaClient.post.findMany.mockResolvedValueOnce([]);
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `query {
          posts {
            id
            title
            authorId
          }
        }`,
    });
    expect(response.body.data.posts).toEqual([]);
    expect(mockPrismaClient.post.findMany).toBeCalledTimes(1);
  });

  it('QUERY: postsWhereTitleContains', async () => {
    mockPrismaClient.post.findMany.mockResolvedValueOnce([]);
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `query PostWhereTitleContains {
          posts(where: { title: { contains: "something" } } ) {
            id
            title
            authorId
          }
        }`,
    });
    expect(response.body.data.posts).toEqual([]);
    expect(mockPrismaClient.post.findMany).toBeCalledTimes(1);
    expect(mockPrismaClient.post.findMany).toBeCalledWith({
      where: {
        title: {
          contains: 'something',
        },
      },
    });
  });
});

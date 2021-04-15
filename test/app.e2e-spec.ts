import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PostCreateInput } from '../prisma/generated/type-graphql';
import { prismaClient as prisma } from '../prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('/graphql (GET)', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        name: 'John',
      },
    });
    const posts: PostCreateInput[] = [
      {
        title: 'Some Title',
        content: 'Some content',
        author: {
          connect: {
            email: user.email,
          },
        },
      },
      {
        title: 'Another Title',
        content: 'Some Other content',
        author: {
          connect: {
            email: user.email,
          },
        },
      },
    ];
    await Promise.all(
      posts.map((post) => {
        return prisma.post.create({ data: post });
      }),
    );
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `query {
          posts {
            id
            title
            authorId
          }
        }`,
    });
    expect(response.body.data.posts).toHaveLength(2);
  });
});

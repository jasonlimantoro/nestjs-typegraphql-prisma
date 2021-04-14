import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

const prisma = new PrismaClient();

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      validate: false,
      dateScalarMode: 'timestamp',
      context: ({ req }) => ({ currentUser: req.user, prisma }),
    }),
    PostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

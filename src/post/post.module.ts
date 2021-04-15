import { Module } from '@nestjs/common';
import { PostCrudResolver } from '../../prisma/generated/type-graphql';

@Module({
  providers: [PostCrudResolver],
})
export class PostModule {}

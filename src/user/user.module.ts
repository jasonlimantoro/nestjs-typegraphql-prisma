import { Module } from '@nestjs/common';
import { UserCrudResolver } from 'prisma/generated/type-graphql';

@Module({
  providers: [UserCrudResolver],
})
export class UserModule {}

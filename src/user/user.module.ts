import { Module } from '@nestjs/common';
import { UserCrudResolver } from '@generated/type-graphql';

@Module({
  providers: [UserCrudResolver],
})
export class UserModule {}

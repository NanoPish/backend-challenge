import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CountersResolver } from './counters/counters.resolver';
import { CountersService } from './counters/counters.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: `${process.cwd()}/graphql/schema.gql`,
      sortSchema: true,
    }),
  ],
  providers: [CountersService, CountersResolver],
})
export class AppModule {}

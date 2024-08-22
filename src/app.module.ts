import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true, //메모리로부터 파일 생성
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})

// @Resolver()
export class AppModule {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}

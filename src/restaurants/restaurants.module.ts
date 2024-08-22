import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Module({
    providers: [RestaurantResolver]
})

@Resolver(of => Restaurant) //resolver를 Restaurant의 resolver로
export class RestaurantsModule {

    @Query(returns => Restaurant) //graphql
    myRestaurant() { //ts
        return true;
    }

}

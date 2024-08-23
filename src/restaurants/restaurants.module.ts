import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurants.service';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant])],
    providers: [RestaurantResolver, RestaurantService]
})

@Resolver(of => Restaurant) //resolver를 Restaurant의 resolver로
export class RestaurantsModule {

    @Query(returns => Restaurant) //graphql
    myRestaurant() { //ts
        return true;
    }

}

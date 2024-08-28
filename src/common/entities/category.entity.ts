import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@InputType('CategoryInputType' ,{ isAbstract:true }) //스키마에 등록되도록 한다.
@ObjectType() //자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity()
export class Category extends CoreEntity {

    @Field(type => String)
    @Column({ unique: true })
    @IsString()
    @Length(5)
    name: string;
    
    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    coverImg: string;

    @Field(type => String)
    @Column({ unique:true })
    @IsString()
    slug: string;

    // @Field(type => String)
    // @Column()
    // @IsString()
    // categoryName: string;

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant, 
        restaurant => restaurant.category)
    restaurants: Restaurant[];

}
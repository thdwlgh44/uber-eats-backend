import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({ isAbstract:true })
@ObjectType() //자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;
    
    @Field(type => Boolean, { nullable: true }) //GraphQL을 위한 데코레이터로 API에 요소를 전달하지 않을 때 default value를 전달할 값을 정의한다.
    @Column({ default: true}) //typeORM을 위한 데코레이터로 DB에 저장될 default value를 default 요소로 정의한다.
    @IsBoolean()
    @IsOptional() //default value를 가진 요소는 API에 전달되지 않게 되고 전달되지 않는 요소는 validatior가 검사하지 않게 한다.
    isVegan: boolean;

    @Field(type => String, { defaultValue: "강북" }) //dto에 내용 추가해서 테이블에 등록
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownerName: string;

    @Field(type => String)
    @Column()
    @IsString()
    categoryName: string;

}
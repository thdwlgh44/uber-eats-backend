import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrpyt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum, IsString } from "class-validator";

enum UserRole {
    Owner,
    Client,
    Delivery
}

registerEnumType(UserRole, { name: 'UserRole' })

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {

    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({select:false})
    @Field(type => String)
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    verified: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if(this.password) {
            try {
                this.password = await bcrpyt.hash(this.password, 10);    
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }    
        }    
    }

    async checkPassword(aPassword: string) : Promise<boolean> {
        try {
            const ok = await bcrpyt.compare(aPassword, this.password);
            return ok;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

}
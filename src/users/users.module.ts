import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UsersResolver } from './users.resolver';
import { UserService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './verification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Verification])],
    providers: [UsersResolver, UserService],
    exports: [UserService],
})
export class UsersModule {}

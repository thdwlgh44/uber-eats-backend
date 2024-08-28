import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entites/user.entity";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account-dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOuput } from "./dtos/edit-profile.dto";
import { Verification } from "./verification.entity";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) 
        private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
    ) {}

    async createAccount({email, password, role}: CreateAccountInput): Promise<CreateAccountOutput> {
        //1. check new user
        try {
            const exists = await this.users.findOne({ where: {email} });
            if (exists) {
                //make error
                return { ok: false, error: 'There is a user with that email already'};
            }
            const user = await this.users.save(this.users.create({ email, password, role }));
            await this.verifications.save(this.verifications.create({
                user,
            }),
        );
            return { ok: true};
        } catch(e) {
            //make error
            return { ok: false, error: "Couldn't create account" };
        }
    }

    async login({email, password}: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.users.findOne({
            where: {
                 email
            },
            select: ['id', 'password'],
        });
            if (!user) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: "Wrong password",
                };
            }
            const token = this.jwtService.sign(user.id);
            return {
                ok:true,
                token,
            }
        } catch(error) {
            return {
                ok: false,
                error,
            }
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne({ where: {id} });
            if (user) {
                return {
                    ok: true,
                    user: user,
                };
            }
        } catch (error) {
            return { ok: false, error: 'User Not Found' };
        }
    }

    async editProfile(
        userId: number,
        {email, password}: EditProfileInput): Promise<EditProfileOuput> {
        try {
            const user = await this.users.findOne({where: {id: userId}});
            if (email) {
                user.email = email;
                user.verified = false;
                await this.verifications.save(this.verifications.create({ user }));
            }
            if (password) {
                user.password = password;
            }
            this.users.save(user); //이미 존재하는 entity의 경우 entity를 update.
            return {
                ok: true,
            };
        } catch (error) {
            return { ok: false, error: 'Could not update profile.' };
        }
        
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne(
                {where: {code},
                relations: {
                    user: true,
                },
            });
            if(verification) {
                verification.user.verified = true;
                await this.users.save(verification.user);
                await this.verifications.delete(verification.id);
                return {ok: true };
            }
            return { ok: false, error: 'Verification not found.' };
        } catch (error) {
            return { ok: false, error };
        }
    }

}
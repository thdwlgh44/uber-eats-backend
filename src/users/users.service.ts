import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entites/user.entity";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account-dto";
import { LoginInput } from "./dtos/login.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
    ) {}

    async createAccount({email, password, role}: CreateAccountInput): Promise<{ ok: boolean, error?: string}> {
        //1. check new user
        try {
            const exists = await this.users.findOne({ where: {email} });
            if (exists) {
                //make error
                return { ok: false, error: 'There is a user with that email already'};
            }
            await this.users.save(this.users.create({ email, password, role }));
            return { ok: true};
        } catch(e) {
            //make error
            return { ok: false, error: "Couldn't create account" };
        }
    }

    async login({email, password}: LoginInput): Promise<{ok :boolean; error?: string; token?: string }> {
        //find the user with the email
        //check if the password is correct
        //make a JWT and git it to the user
        try {
            const user = await this.users.findOne({where: {email}});
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
            return {
                ok:true,
                token: "lalalalala",
            }
        } catch(error) {
            return {
                ok: false,
                error,
            }
        }
    }

}
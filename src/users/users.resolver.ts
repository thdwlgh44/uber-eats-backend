import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entites/user.entity";
import { UserService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account-dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthUser } from "src/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOuput } from "./dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-email.dto";

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly userService: UserService
    ) {}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            return this.userService.createAccount(createAccountInput);
        } catch (error) {
            return {
                error,
                ok: false,
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return this.userService.login(loginInput);
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }

    @Query(retunrs => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
           const user = await this.userService.findById(userProfileInput.userId);
           if(!user) {
            throw Error();
           }
           return {
            ok: true,
            user,
           };
        } catch(e) {
            return {
                error: "User Not Found",
                ok:false,
            };
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOuput)
    async editProfile(
        @AuthUser() authUser: User, 
        @Args('input') editProfileInput: EditProfileInput,
        ): Promise<EditProfileOuput> {
            try {
                console.log(editProfileInput);
                await this.userService.editProfile(authUser.id, editProfileInput);
                return {
                    ok: true,
                };
            } catch(error) {
                return {
                    ok:false,
                    error,
                };
            }
        }

        @Mutation(returns => VerifyEmailOutput)
        async verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
            try {
                await this.userService.verifyEmail(code);
                return {
                    ok:true,
                };
            } catch(error) {
                return {
                    ok:false,
                    error
                }
            }
        }
}
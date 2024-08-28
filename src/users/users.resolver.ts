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
import { Role } from "src/auth/role.decorator";

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly userService: UserService
    ) {}

    //resolver에 metatdata role이 없으면 public resolver라는 뜻
    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        return this.userService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.userService.login(loginInput);
    }

    @Query(retunrs => User)
    @Role(["Any"])
    me(@AuthUser() authUser: { user: User }): User {
    // me(@AuthUser() authUser: User) {
        console.log('authUser:', authUser)
        return authUser.user;
    }

    @Query(returns => UserProfileOutput)
    @Role(["Any"])
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        return this.userService.findById(userProfileInput.userId);
    }

    @Mutation(returns => EditProfileOuput)
    @Role(["Any"])
    async editProfile(
        @AuthUser() authUser: User, 
        @Args('input') editProfileInput: EditProfileInput,
    ): Promise<EditProfileOuput> {
        return this.userService.editProfile(authUser.id, editProfileInput);
    }

    @Mutation(returns => VerifyEmailOutput)
    verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
        return this.userService.verifyEmail(code);
    }
}
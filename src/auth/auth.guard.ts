import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { AllowedRoles } from "./role.decorator";
import { User } from "src/users/entites/user.entity";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user:User = gqlContext['user'];
        //role은 있지만 유저의 정보가 없는 경우
        if (!user) {
            return false;
        }
        //유저의 정보가 있지만 요청한 API가 모든 권한에서 작동해도 되는 경우
        if (roles.includes("Any")) {
            return true;
        }
        //유저의 정보가 있고 설정된 권한에서만 작동해야하는 API인 경우
        return roles.includes(user.role);
    }
    
}
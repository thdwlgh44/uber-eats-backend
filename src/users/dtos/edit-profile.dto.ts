import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { User } from "../entites/user.entity";


@ObjectType()
export class EditProfileOuput extends CoreOutput {

}

@InputType()
export class EditProfileInput extends PartialType(
    PickType(User, ["email", "password"]),
) {}
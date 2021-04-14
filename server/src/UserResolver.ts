import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from "bcryptjs";
import { LoginResponse } from "./entity/LoginResponse";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./sendRefreshToken";
import { getConnection } from "typeorm";

// @InputType()
// class EmailPasswordInput {
//   @Field(() => String)
//   email: string;

//   @Field(() => String)
//   password: string;
// }

// @InputType()
// class MovieUpdateInput {
//   @Field(() => String, { nullable: true })
//   title?: string;

//   @Field(() => Int, { nullable: true })
//   minutes?: number;
// }

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @UseMiddleware(isAuth)
  @Query(() => String)
  protectedQuery(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `Your userId is: ${payload?.userId}. Paid Schemes are ${payload?.validCodes}`;
  }

  //TO INVALIDATE A TOKEN FOR A PARTICULAR USER, CHANGE THE TOKEN VERSION.
  //Mutation for revoking refresh token here is just for testing purpose.
  //In a porduction app, we must use a function in "forgot password" page or something.
  //It should not be exposed.
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, "tokenVersion", 1);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  @Query(() => [User])
  async users() {
    const users = await User.find();
    return users;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
    //@Arg("emailPasswordInput", () => EmailPasswordInput)
    //emailPasswordInput: EmailPasswordInput
  ) {
    //const { email, password } = emailPasswordInput;
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
      //Redirect to register
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Password mismatch");
    }

    //login successful

    //res.cookie("jid", createRefreshToken(user), { httpOnly: true });
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }
}

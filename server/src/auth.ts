import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

export const createAccessToken = (user: User) => {
  return sign(
    {
      userId: user.id,
      userEmail: user.email,
      validCodes: ["aa", "adad", "f3r3f"],
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    {
      //store different attributes in refresh token.
      userId: user.id,
      userEmail: user.email,
      tokenVersion: user.tokenVersion,
      validCodes: ["aa", "adad", "f3r3f"],
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "2d",
    }
  );
};

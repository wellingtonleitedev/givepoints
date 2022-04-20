import authConfig from "../../config/auth.config";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  twitterToken?: string;
  twitchToken?: string;
}

export const ensureAuthentication = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error("JWT Token is missing");
  } else {
    handleAuth(authHeader);
    const decode = handleAuth(authHeader);

    const { sub, twitterToken, twitchToken } = decode as TokenPayload;

    request.user = {
      id: sub,
      twitterToken,
      twitchToken,
    };
    next();
  }
};

export const authentication = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const decode = handleAuth(authHeader);

    const { sub, twitterToken, twitchToken } = decode as TokenPayload;

    request.user = {
      id: sub,
      twitterToken,
      twitchToken,
    };
  }

  next();
};

const handleAuth = (authHeader: string) => {
  const [, token] = authHeader.split(" ");

  try {
    const decode = verify(token, authConfig.jwt.secret);

    return decode;
  } catch {
    throw new Error("Invalid JWT Token");
  }
};

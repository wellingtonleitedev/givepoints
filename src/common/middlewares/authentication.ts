import authConfig from "../../config/auth.config";
import { NextFunction, Request, response, Response } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../../common/errors/appError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  twitterId: string;
  twitchId: string;
}

export const ensureAuthentication = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT Token is missing", 401);
  }

  authentication(request, response, next);
};

export const authentication = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    try {
      const [, token] = authHeader.split(" ");

      const decode = verify(token, authConfig.jwt.secret);

      const { sub, twitterId, twitchId } = decode as TokenPayload;

      request.user = {
        id: sub,
        twitterId,
        twitchId,
      };
    } catch {
      throw new AppError("Invalid JWT Token", 401);
    }
  }

  next();
};

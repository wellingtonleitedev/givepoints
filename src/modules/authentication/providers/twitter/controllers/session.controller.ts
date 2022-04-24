import cache from "../../../../../config/cache.config";
import client from "../../../../../config/twitter.config";
import { Request, Response } from "express";
import createSessionService from "../../common/services/createSession.service";
import AppError from "../../../../../common/errors/appError";

export const create = async (request: Request, response: Response) => {
  const { url, state, codeVerifier } = client.generateOAuth2AuthLink(
    process.env.TWITTER_CALLBACK_URL!,
    { scope: ["tweet.read", "users.read", "offline.access"] }
  );

  cache.set("@twitter:credentials", JSON.stringify({ state, codeVerifier }));

  return response.json({ url });
};

export const show = async (request: Request, response: Response) => {
  const { state, code } = request.query as {
    state: string;
    code: string;
  };

  const storedCredentials = await cache.get("@twitter:credentials");

  const { codeVerifier, state: sessionState } = storedCredentials
    ? JSON.parse(storedCredentials)
    : null;

  if (!codeVerifier || !state || !sessionState || !code) {
    throw new AppError("You denied the app or your session expired!", 401);
  }

  if (state !== sessionState) {
    throw new AppError("Stored tokens didnt match!", 401);
  }

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL!,
    });

    const { data: twitterUser } = await loggedClient.v2.me();

    cache.set(
      `@twitter:token:${twitterUser.id}`,
      JSON.stringify({ accessToken, refreshToken })
    );

    const { user, token } = await createSessionService({
      userId: request.user?.id,
      data: {
        name: twitterUser.name,
        twitterId: twitterUser.id,
        twitterUsername: twitterUser.username,
        twitchId: request.user?.twitchId,
      },
    });

    Object.assign(user, {
      twitterLogged: !!twitterUser.id,
      twitchLogged: !!request.user?.twitchId,
    });

    return response.json({ user, token });
  } catch (error) {
    throw new AppError("Invalid verifier or access tokens!", 401);
  }
};

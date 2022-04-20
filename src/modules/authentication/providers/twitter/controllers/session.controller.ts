import cache from "../../../../../config/cache.config";
import client from "../../../../../config/twitter.config";
import { Request, Response } from "express";
import createSessionService from "../../common/services/createSession.service";

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
    throw new Error("You denied the app or your session expired!");
  }

  if (state !== sessionState) {
    throw new Error("Stored tokens didnt match!");
  }

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL!,
    });

    const { data: twitterUser } = await loggedClient.v2.me();

    const { user, token } = await createSessionService({
      userId: request.user?.id,
      data: {
        twitterId: twitterUser.id,
        twitterUsername: twitterUser.username,
        name: twitterUser.name,
        twitterToken: accessToken,
        twitchToken: request.user?.twitchToken,
      },
    });

    Object.assign(user, {
      twitterLogged: !!request.user?.twitterToken,
      twitchLogged: !!request.user?.twitchToken,
    });

    return response.json({ user, token });
  } catch (error) {
    throw new Error("Invalid verifier or access tokens!");
  }
};

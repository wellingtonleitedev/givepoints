import "dotenv/config";
import { Request, Response } from "express";
import client from "../../../../../config/twitter.config";

export const create = async (request: Request, response: Response) => {
  const { url } = request.session;

  response.json(url);
};

export const show = async (request: Request, response: Response) => {
  const { state, code } = request.query as {
    state: string;
    code: string;
  };

  const { codeVerifier, state: sessionState } = request.session;

  if (!codeVerifier || !state || !sessionState || !code) {
    return response
      .status(400)
      .send("You denied the app or your session expired!");
  }

  if (state !== sessionState) {
    return response.status(400).send("Stored tokens didnt match!");
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

    const { data: userObject } = await loggedClient.v2.me();

    response.json({ userObject });
  } catch (error) {
    response.status(403).send("Invalid verifier or access tokens!");
  }
};

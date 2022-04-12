import client from "../../../../../config/twitter.config";
import { NextFunction, Request, Response } from "express";

let session = {
  url: "",
  state: "",
  codeVerifier: "",
};

export default async function (
  request: Request,
  _: Response,
  next: NextFunction
) {
  if (session.state && session.codeVerifier) {
    request.session = session;
    next();
  }

  const { url, state, codeVerifier } = await client.generateOAuth2AuthLink(
    process.env.TWITTER_CALLBACK_URL!,
    { scope: ["tweet.read", "users.read", "offline.access"] }
  );

  session = {
    url,
    state,
    codeVerifier,
  };

  request.session = session;

  next();
}

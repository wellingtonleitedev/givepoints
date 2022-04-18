import { Request, Response } from "express";
import createSession from "../services/createSession.service";

export const create = async (request: Request, response: Response) => {
  const { url } = request.session;

  return response.json(url);
};

export const show = async (request: Request, response: Response) => {
  const { user, token } = await createSession({
    userId: request.user?.id,
    twitchToken: request.user?.twitchToken,
    state: request.query.state as string,
    code: request.query.code as string,
    codeVerifier: request.session.codeVerifier!,
    sessionState: request.session.state!,
  });

  return response.json({ user, token });
};

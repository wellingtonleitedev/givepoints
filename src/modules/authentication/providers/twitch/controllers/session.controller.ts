import "dotenv/config";
import axios from "axios";
import { Request, Response } from "express";
import createSessionService from "../../common/services/createSession.service";
import cache from "../../../../../config/cache.config";

export const create = async (request: Request, response: Response) => {
  const { data } = await axios.post("https://id.twitch.tv/oauth2/token", {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    code: request.query.code,
    grant_type: "authorization_code",
    redirect_uri: process.env.TWITCH_CALLBACK_URL,
  });

  const { data: twitchUser } = await axios.get(
    "https://id.twitch.tv/oauth2/validate",
    {
      headers: {
        Authorization: `OAuth ${data.access_token}`,
      },
    }
  );

  cache.set(`@twitch:token:${twitchUser.user_id}`, data.access_token);

  const { user, token } = await createSessionService({
    userId: request.user?.id,
    data: {
      twitchId: twitchUser.user_id,
      twitchUsername: twitchUser.login,
      twitterId: request.user?.twitterId,
    },
  });

  Object.assign(user, {
    twitterLogged: !!request.user?.twitterId,
    twitchLogged: !!twitchUser.user_id,
  });

  response.json({ user, token });
};

import "dotenv/config";
import axios from "axios";
import { Request, Response } from "express";

export const create = async (request: Request, response: Response) => {
  const { data } = await axios.post("https://id.twitch.tv/oauth2/token", {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    code: request.query.code,
    grant_type: "authorization_code",
    redirect_uri: process.env.TWITCH_CALLBACK_URL,
  });

  const { data: user } = await axios.get(
    "https://id.twitch.tv/oauth2/validate",
    {
      headers: {
        Authorization: `OAuth ${data.access_token}`,
      },
    }
  );

  response.json({ user });
};

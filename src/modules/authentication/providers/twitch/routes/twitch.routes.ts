import "dotenv/config";
import { authentication } from "../../../../../common/middlewares/authentication";
import { Router } from "express";
import { create } from "../controllers/session.controller";
import url from "url";

const twitchRoutes = Router();

twitchRoutes.get("/twitch", (_, response) => {
  const authUrl = url.format({
    pathname: "https://id.twitch.tv/oauth2/authorize",
    query: {
      client_id: process.env.TWITCH_CLIENT_ID,
      scopes: ["openid", "user:read:email"],
      response_type: "code",
      redirect_uri: process.env.TWITCH_CALLBACK_URL,
      claims: JSON.stringify({
        id_token: { email: null, picture: null, preferred_username: null },
      }),
    },
  });

  response.json({ url: authUrl });
});
twitchRoutes.get("/callback/twitch", authentication, create);

export default twitchRoutes;

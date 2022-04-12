import { Router } from "express";
import twitchRoutes from "./providers/twitch/routes/twitch.routes";
import twitterRoutes from "./providers/twitter/routes/twitter.routes";

const authRoutes = Router();

authRoutes.use(twitterRoutes);
authRoutes.use(twitchRoutes);

export default authRoutes;

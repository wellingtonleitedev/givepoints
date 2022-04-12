import { Router } from "express";
import { create } from "../controllers/session.controller";

const twitchRoutes = Router();

twitchRoutes.get("/callback/twitch", create);

export default twitchRoutes;

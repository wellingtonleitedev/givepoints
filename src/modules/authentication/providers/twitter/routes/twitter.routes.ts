import { authentication } from "../../../../../common/middlewares/authentication";
import { Router } from "express";
import { create, show } from "../controllers/session.controller";
import authMiddleware from "../middlewares/auth.middleware";

const twitterRoutes = Router();

twitterRoutes.get("/twitter", authMiddleware, create);
twitterRoutes.get("/callback/twitter", authMiddleware, authentication, show);

export default twitterRoutes;

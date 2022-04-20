import { authentication } from "../../../../../common/middlewares/authentication";
import { Router } from "express";
import { create, show } from "../controllers/session.controller";

const twitterRoutes = Router();

twitterRoutes.get("/twitter", create);
twitterRoutes.get("/callback/twitter", authentication, show);

export default twitterRoutes;

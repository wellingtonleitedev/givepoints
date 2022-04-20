import { ensureAuthentication } from "../../../common/middlewares/authentication";
import { Router } from "express";
import { create } from "../controllers/points.controller";

const pointsRoutes = Router();

pointsRoutes.post("/add", ensureAuthentication, create);

export default pointsRoutes;

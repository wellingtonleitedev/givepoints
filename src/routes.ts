import { Router } from "express";
import authRoutes from "./modules/authentication/routes";
import pointsRoutes from "./modules/points/routes/points.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/points", pointsRoutes);

export default routes;

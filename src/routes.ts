import { Router } from "express";
import authRoutes from "./modules/authentication/routes";

const routes = Router();

routes.use("/auth", authRoutes);

export default routes;

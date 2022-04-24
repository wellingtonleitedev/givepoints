import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";
import routes from "./routes";
import errorHandler from "./common/middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

app.listen("3333", () => {
  console.log("✅ App running");
});

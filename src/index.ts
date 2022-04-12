import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use("/api", routes);

app.listen("3333", () => {
  console.log("✅ App running");
});

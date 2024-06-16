import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import createHttpError, { isHttpError } from "http-errors";
import routes from "./routes";
import morgan from "morgan";
import env from "./utils/validateEnv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./db/connection";

/* Configuration and Middlewares */
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

/* Creating Server */
const PORT = env.PORT || 8080;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

/* DataBase Connection */
dbConnection();

/* Routes */
app.use("/api", routes());

/* Error Handling */
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import createHttpError from "http-errors";

export interface IRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies?.jwt) {
    return res.status(404).json({
      message: "There Is No Token in Cookies Yet, Please Go To Login First",
    });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (token && token === req.cookies?.jwt) {
    jwt.verify(token, env.JWT_SECRET, (error, decode) => {
      if (error) {
        return res.status(404).json({
          message: error,
          error,
        });
      } else {
        req.userId = (decode as any).id;
        if (!req.userId) {
          throw createHttpError(401, "Invalid token.");
        }
        next();
      }
    });
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};

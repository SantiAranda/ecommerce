import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/http.error";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

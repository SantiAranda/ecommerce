import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http.error";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};

import type { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).send(error.message);
      }
      return res.status(500).send("Internal Server Error");
    }
  };

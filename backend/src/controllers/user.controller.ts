import type { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { userSchema } from "../schemas/user.schema";
import { BadRequestError } from "../utils/http.error";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerData = req.body;
      const user = await this.userService.register(registerData);
      const userReponse = userSchema.parse(user);
      res
        .status(201)
        .json({ message: "User registered successfully", user: userReponse });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (token) {
      throw new BadRequestError("User already logged in");
    }

    try {
      const loginData = req.body;
      const token = await this.userService.login(loginData);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  };
}

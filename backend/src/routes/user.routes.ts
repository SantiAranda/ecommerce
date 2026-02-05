import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { validate } from "../middlewares/validation.middleware";
import { registerSchema, loginSchema } from "../schemas/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.post("/logout", authMiddleware, userController.logout);

export default router;

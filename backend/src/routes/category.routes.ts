import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;

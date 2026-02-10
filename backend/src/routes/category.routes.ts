import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";
import {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "../schemas/category.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.getAll);
router.get(
  "/:id",
  validate(getCategorySchema),
  categoryController.getById,
);
router.post(
  "/",
  authMiddleware,
  validate(createCategorySchema),
  categoryController.create,
);
router.put(
  "/:id",
  authMiddleware,
  validate(updateCategorySchema),
  categoryController.update,
);
router.delete(
  "/:id",
  authMiddleware,
  validate(deleteCategorySchema),
  categoryController.delete,
);
export default router;

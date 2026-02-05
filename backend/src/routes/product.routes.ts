import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "../schemas/product.schema";

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

// quer
router.get("/", productController.getAll);
router.get("/:id", validate(getProductSchema), productController.getById);
router.post("/", validate(createProductSchema), productController.create);
router.put("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", validate(deleteProductSchema), productController.delete);

export default router;

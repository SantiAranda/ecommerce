import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import {
  getOrderSchema,
  createOrderWithItemsSchema,
  updateOrderSchema,
} from "../schemas/order.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";

const router = Router();
const orderService = new OrderService();
const orderController = new OrderController(orderService);

router.get("/", orderController.getAll);

router.get(
  "/:id",
  authMiddleware,
  validate(getOrderSchema),
  orderController.getById,
);

router.post(
  "/",
  authMiddleware,
  validate(createOrderWithItemsSchema),
  orderController.create,
);

router.patch(
  "/:id/status",
  authMiddleware,
  validate(updateOrderSchema),
  orderController.updateStatus,
);

export default router;

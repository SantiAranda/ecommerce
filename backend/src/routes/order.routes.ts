import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";

const router = Router();
const orderService = new OrderService();
const orderController = new OrderController(orderService);

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post("/", orderController.create);
router.patch("/:id/status", orderController.updateStatus);

export default router;

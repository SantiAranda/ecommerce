import type { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  constructor(private orderService: OrderService) {}

  getAll = async (req: Request, res: Response) => {
    const orders = await this.orderService.getAll();
    res.json(orders);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    const order = await this.orderService.getById(id);
    res.json(order);
  };

  create = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const order = await this.orderService.create(userId, req.body);
    res.status(201).json(order);
  };

  updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID de producto no válido" });
    }
    
    const { status } = req.body;
    
    await this.orderService.updateStatus(id, status);
    res.status(204).send();
  };
}

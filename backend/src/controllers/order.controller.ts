import type { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  constructor(private orderService: OrderService) {}

  getAll = async (req: Request, res: Response) => {};
  getById = async (req: Request, res: Response) => {};
  create = async (req: Request, res: Response) => {};
  updateStatus = async (req: Request, res: Response) => {};
}

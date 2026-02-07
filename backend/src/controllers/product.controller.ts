import type { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = req.query.category as string | undefined;
      const products = await this.productService.getAll(category);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ message: "ID de producto no válido" });
      }

      const product = await this.productService.getById(id);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ message: "ID de producto no válido" });
      }

      await this.productService.update(id, req.body);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({ message: "ID de producto no válido" });
      }

      await this.productService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

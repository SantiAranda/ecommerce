import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (typeof id !== "string") {
        return res.status(400).json({ message: "ID de categoría no válido" });
      }
      
      const category = await this.categoryService.getById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json(category);
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
      
      const category = await this.categoryService.update(id, req.body);
      res.json(category);
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
      
      await this.categoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

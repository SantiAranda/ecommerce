import type { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAll = async (req: Request, res: Response) => {};
  getById = async (req: Request, res: Response) => {};
  create = async (req: Request, res: Response) => {};
  update = async (req: Request, res: Response) => {};
  delete = async (req: Request, res: Response) => {};
}

import { prisma } from "../lib/prisma";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { NotFoundError, ConflictError } from "../utils/http.error";

export class CategoryService {
  async getAll() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(data: CreateCategoryInput) {
    const { name } = data;

    return await prisma.category.create({
      data: { name }
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    await this.getById(id);

    if (data.name) {
      const existing = await prisma.category.findFirst({
        where: { 
          name: data.name,
          NOT: { id }
        }
      });

      if (existing) {
        throw new ConflictError(`Category with name "${data.name}" already exists`);
      }
    }

    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    await this.getById(id);
    
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      throw new ConflictError("Cannot delete category with associated products");
    }

    return await prisma.category.delete({
      where: { id }
    });
  }
}

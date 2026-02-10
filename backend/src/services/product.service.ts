import { prisma } from "../lib/prisma";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../utils/http.error";
import { Decimal } from "@prisma/client/runtime/client";

export class ProductService {
  constructor() {}

  async getAll(category?: string) {
    if (category) {
      return await prisma.product.findMany({
        where: { category: { name: category } },
        include: { category: true },
      });
    }

    return await prisma.product.findMany({ include: { category: true } });
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const { name, price, stock, categoryId, description } = data;
    
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        description,
        category: { connect: { id: categoryId } },
      },
    });

    if (!product) {
      throw new InternalServerError("Failed to create product");
    }

    return product;
  }

  async update(id: string, data: UpdateProductInput) {
    const { name, description, price, stock, categoryId } = data;
    
    await this.getById(id);
    
    if (categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        throw new BadRequestError("Category not found");
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = new Decimal(price);
    if (stock !== undefined) updateData.stock = stock;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const result = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return result;
  }

  async delete(id: string) {
    await this.getById(id);
    
    return await prisma.product.delete({
      where: { id },
    });
  }
}

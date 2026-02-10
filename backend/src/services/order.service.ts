import { prisma } from "../lib/prisma";
import type { CreateOrderWithItemsInput, UpdateOrderInput } from "../schemas/order.schema";
import { NotFoundError } from "../utils/http.error";

export class OrderService {
  constructor() { }
  
  async getAll() {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      }
    });
    
    return orders;
  }
  
  async getById(id: string) { 
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      }
    });
    
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }
    
    return order;
  }
  
  async create(userId: string, data: CreateOrderWithItemsInput) {
    const { cartItems, status } = data;

    const productIds = cartItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundError("One or more products not found");
    }

    let total = 0;
    
    const orderItemsData = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found (unexpected)`);
      }
      
      const itemTotal = Number(product.price) * item.quantity;
      total += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total: total,
          status: status || "PENDING",
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
        },
      });

      return order;
    });
  }
  
  async updateStatus(id: string, status: UpdateOrderInput) {
    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }
    
    return await prisma.order.update({
      where: { id },
      data: status,
    });
  }
}

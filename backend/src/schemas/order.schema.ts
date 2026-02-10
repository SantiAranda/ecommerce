import { z } from "zod";

// model Order {
//   id          String      @id @default(uuid())
//   userId      String
//   user        User        @relation(fields: [userId], references: [id])
//   total       Decimal     @db.Decimal(10, 2)
//   status      OrderStatus @default(PENDING)
//   orderItems  OrderItem[]
//   createdAt   DateTime    @default(now())
//   updatedAt   DateTime    @updatedAt

//   @@map("orders")
// }

const idSchema = z.string();

const userIdSchema = z.string("User ID is required");

const totalSchema = z
  .number("Total must be a number")
  .min(0, "Total must be at least 0")
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
    message: "Total can have at most two decimal places",
  });

const statusSchema = z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]);

const cartItemShcema = z.object({
  productId: z.string("Product ID is required"),
  quantity: z
    .number("Quantity must be a number")
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

export const createOrderWithItemsSchema = z.object({
  body: z.object({
    status: statusSchema.optional(),
    cartItems: z
      .array(cartItemShcema)
      .min(1, "At least one cart item is required"),
  }),
});

export const updateOrderSchema = z.object({
  params: idSchema,
  body: z.object({
    status: statusSchema,
  }),
});

export const getOrderSchema = z.object({
  params: idSchema,
});

export const deleteOrderSchema = z.object({
  params: idSchema,
});

export type CreateOrderWithItemsInput = z.infer<typeof createOrderWithItemsSchema>["body"];
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>["body"];
export type GetOrderInput = z.infer<typeof getOrderSchema>["params"];
export type DeleteOrderInput = z.infer<typeof deleteOrderSchema>["params"];

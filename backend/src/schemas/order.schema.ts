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

export const createOrderSchema = z.object({
  body: z.object(
    {
      userId: userIdSchema,
      total: totalSchema,
      status: statusSchema,
    },
    "Invalid order data",
  ),
});

export const updateOrderSchema = z.object({
  params: idSchema,
  body: z
    .object({
      total: totalSchema,
      status: statusSchema,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getOrderSchema = z.object({
  params: idSchema,
});

export const deleteOrderSchema = z.object({
  params: idSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>["body"];
export type GetOrderInput = z.infer<typeof getOrderSchema>["params"];
export type DeleteOrderInput = z.infer<typeof deleteOrderSchema>["params"];

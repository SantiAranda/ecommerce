import { z } from "zod";

// model Product {
//   id          String      @id @default(uuid())
//   name        String
//   description String?
//   price       Decimal     @db.Decimal(10, 2)
//   stock       Int         @default(0)
//   categoryId  String
//   category    Category    @relation(fields: [categoryId], references: [id])
//   orderItems  OrderItem[]
//   createdAt   DateTime    @default(now())
//   updatedAt   DateTime    @updatedAt

//   @@map("products")
// }

const idSchema = z.string();

const nameSchema = z
  .string("Name is required")
  .min(2, "Name must be at least 2 characters long")
  .max(255, "Name must be at most 255 characters long");

const descriptionSchema = z
  .string()
  .max(1000, "Description must be at most 1000 characters long")
  .optional();

const priceSchema = z
  .number("Price must be a number")
  .min(0, "Price must be at least 0")
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
    message: "Price can have at most two decimal places",
  });

const stockSchema = z
  .number("Stock must be a number")
  .int("Stock must be an integer")
  .min(0, "Stock must be at least 0");

const categoryIdSchema = z.string("Category ID is required");

export const createProductSchema = z.object({
  body: z.object(
    {
      name: nameSchema,
      description: descriptionSchema,
      price: priceSchema,
      stock: stockSchema,
      categoryId: categoryIdSchema,
    },
    "Invalid product data",
  ),
});

export const updateProductSchema = z.object({
  params: idSchema,
  body: z
    .object({
      name: nameSchema,
      description: descriptionSchema,
      price: priceSchema,
      stock: stockSchema,
      categoryId: categoryIdSchema,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getProductSchema = z.object({
  params: idSchema,
});

export const deleteProductSchema = z.object({
  params: idSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type GetProductInput = z.infer<typeof getProductSchema>["params"];
export type DeleteProductInput = z.infer<typeof deleteProductSchema>["params"];

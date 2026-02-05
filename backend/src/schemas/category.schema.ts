import { z } from "zod";

// model Category {
//   id        String    @id @default(uuid())
//   name      String    @unique
//   products  Product[]
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt

//   @@map("categories")
// }

const idSchema = z.string();

const nameSchema = z
  .string("Name is required")
  .min(2, "Name must be at least 2 characters long")
  .max(255, "Name must be at most 255 characters long");

export const createCategorySchema = z.object({
  body: z.object(
    {
      name: nameSchema,
    },
    "Invalid category data",
  ),
});

export const updateCategorySchema = z.object({
  params: idSchema,
  body: z
    .object({
      name: nameSchema,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getCategorySchema = z.object({
  params: idSchema,
});

export const deleteCategorySchema = z.object({
  params: idSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
export type GetCategoryInput = z.infer<typeof getCategorySchema>["params"];
export type DeleteCategoryInput = z.infer<
  typeof deleteCategorySchema
>["params"];

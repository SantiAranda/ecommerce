import { z } from "zod";

// model User {
//   id        String   @id @default(uuid())
//   email     String   @unique
//   password  String
//   name      String?
//   role      Role     @default(USER)
//   orders    Order[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("users")
// }

const idSchema = z.string();

const emailSchema = z
  .email("Invalid email address")
  .max(255, "Email must be at most 255 characters long");

const nameSchema = z
  .string("Name is required")
  .min(2, "Name must be at least 2 characters long")
  .max(255, "Name must be at most 255 characters long");

const passwordSchema = z
  .string("Password is required")
  .min(6, "Password must be at least 6 characters long")
  .max(255, "Password must be at most 255 characters long");

const roleSchema = z.enum(["USER", "ADMIN"]);

export const registerSchema = z.object({
  body: z.object(
    {
      email: emailSchema,
      name: nameSchema,
      password: passwordSchema,
    },
    "Invalid registration data",
  ),
});

export const loginSchema = z.object({
  body: z.object(
    {
      email: emailSchema,
      password: passwordSchema,
    },
    "Invalid login data",
  ),
});

export const updateUserSchema = z.object({
  params: idSchema,
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      name: nameSchema,
      role: roleSchema,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const deleteUserSchema = z.object({
  params: idSchema,
});

export const userSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  role: roleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getUserSchema = z.object({
  params: idSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>["params"];
export type GetUserInput = z.infer<typeof getUserSchema>["params"];
export type User = z.infer<typeof userSchema>;

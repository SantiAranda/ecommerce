import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RegisterInput, LoginInput } from "../schemas/user.schema";
import { BadRequestError } from "../utils/http.error";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export class UserService {
  constructor() {}

  async register(data: RegisterInput) {
    const { email, name, password } = data;

    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingEmail) {
      throw new BadRequestError("Email already in use");
    }

    return prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
      },
    });
  }
  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }
}

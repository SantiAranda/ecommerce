import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

// Mock Prisma
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    const validUser = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should register a new user successfully (Happy Path)', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-id-123',
        ...validUser,
        password: 'hashed-password',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/users/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(validUser.email);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: validUser.email } });
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should return 400 if email already exists (Sad Path)', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existing-id' });

      const response = await request(app)
        .post('/api/users/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already in use');
    });

    it('should return 400 for invalid input (Sad Path)', async () => {
      const invalidUser = {
        email: 'not-an-email',
        name: 'T', // too short
        password: '123', // too short
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      // Zod validation errors structure might vary, usually it returns an array of errors or a message
      // Based on error middleware, let's assume it returns something
    });
  });

  describe('POST /api/users/login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials (Happy Path)', async () => {
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id-123',
        email: credentials.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      });

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for invalid credentials (Sad Path - Wrong Password)', async () => {
      const hashedPassword = await bcrypt.hash('otherpassword', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id-123',
        email: credentials.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      });

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 400 if user not found (Sad Path)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });
});

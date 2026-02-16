import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';

// Mock Prisma
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

describe('Order Endpoints', () => {
  let token: string;
  const userId = 'user-id-123';

  beforeAll(() => {
    token = jwt.sign({ id: userId, email: 'test@example.com' }, JWT_SECRET, { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    it('should return all orders (Happy Path)', async () => {
      const mockOrders = [
        { id: 'order-1', userId, total: 100, status: 'PENDING' },
      ];
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      // Note: Endpoint /api/orders in order.routes.ts is NOT protected by authMiddleware according to the file content read previously!
      // router.get("/", orderController.getAll); -> No authMiddleware
      
      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe('order-1');
      expect(prisma.order.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/orders', () => {
    const validOrder = {
      cartItems: [
        { productId: 'prod-1', quantity: 2 },
      ],
      status: 'PENDING',
    };

    it('should create an order successfully (Happy Path)', async () => {
      // Mock product finding
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { id: 'prod-1', name: 'Product 1', price: 50 },
      ]);

      // Mock transaction to execute callback
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(prisma);
      });

      // Mock order creation inside transaction
      (prisma.order.create as jest.Mock).mockResolvedValue({
        id: 'new-order-1',
        userId,
        total: 100,
        status: 'PENDING',
        orderItems: [
          { productId: 'prod-1', quantity: 2, price: 50 }
        ]
      });

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', `access_token=${token}`)
        .send(validOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'new-order-1');
      expect(response.body.total).toBe(100);
    });

    it('should return 404 if product not found (Sad Path)', async () => {
      // Mock product finding - empty or missing one
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', `access_token=${token}`)
        .send(validOrder);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('One or more products not found');
    });

    it('should return 401 if not authenticated (Sad Path)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrder);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No token provided');
    });
  });
});

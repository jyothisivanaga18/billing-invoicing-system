import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../utils/validators';

export async function getCustomers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      userId,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search as string } },
          { email: { contains: search as string } },
          { company: { contains: search as string } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { invoices: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      customers,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            dueDate: true,
          },
        },
        _count: { select: { invoices: true, payments: true } },
      },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const data = createCustomerSchema.parse(req.body);

    const existing = await prisma.customer.findUnique({
      where: { userId_email: { userId, email: data.email } },
    });

    if (existing) {
      res.status(409).json({ error: 'Customer with this email already exists' });
      return;
    }

    const customer = await prisma.customer.create({
      data: { ...data, userId },
    });

    res.status(201).json({ customer });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const data = updateCustomerSchema.parse(req.body);

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const updated = await prisma.customer.update({
      where: { id },
      data,
    });

    res.json({ customer: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
}

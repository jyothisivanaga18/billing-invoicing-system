import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from '../utils/validators';
import {
  generateInvoiceNumber,
  calculateInvoiceTotals,
} from '../utils/helpers';

export async function getInvoices(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10', status, customerId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      userId,
      ...(status && { status: status as string }),
      ...(customerId && { customerId: customerId as string }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, email: true, company: true },
          },
          items: true,
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      invoices,
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

export async function getInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        customer: true,
        items: { orderBy: { sortOrder: 'asc' } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function createInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const data = createInvoiceSchema.parse(req.body);

    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const totals = calculateInvoiceTotals(data.items, data.discountAmount);
    const invoiceNumber = generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId,
        customerId: data.customerId,
        dueDate: new Date(data.dueDate),
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.totalAmount,
        currency: data.currency || 'USD',
        notes: data.notes,
        terms: data.terms,
        items: {
          create: data.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            amount: item.quantity * item.unitPrice,
            sortOrder: index,
          })),
        },
      },
      include: {
        customer: true,
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });

    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function updateInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const data = updateInvoiceSchema.parse(req.body);

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
      res.status(400).json({ error: 'Cannot edit a paid or cancelled invoice' });
      return;
    }

    const updateData: Record<string, unknown> = {};

    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.currency) updateData.currency = data.currency;

    if (data.items) {
      const totals = calculateInvoiceTotals(
        data.items,
        data.discountAmount ?? 0
      );
      updateData.subtotal = totals.subtotal;
      updateData.taxAmount = totals.taxAmount;
      updateData.discountAmount = totals.discountAmount;
      updateData.totalAmount = totals.totalAmount;

      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      await prisma.invoiceItem.createMany({
        data: data.items.map((item, index) => ({
          invoiceId: id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate ?? 0,
          amount: item.quantity * item.unitPrice,
          sortOrder: index,
        })),
      });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });

    res.json({ invoice: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'PAID') {
      res.status(400).json({ error: 'Cannot delete a paid invoice' });
      return;
    }

    await prisma.invoice.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({ success: true, message: 'Invoice cancelled successfully' });
  } catch (error) {
    next(error);
  }
}

export async function sendInvoice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: { customer: true },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'CANCELLED') {
      res.status(400).json({ error: 'Cannot send a cancelled invoice' });
      return;
    }

    await prisma.invoice.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });

    res.json({ success: true, message: 'Invoice sent successfully' });
  } catch (error) {
    next(error);
  }
}

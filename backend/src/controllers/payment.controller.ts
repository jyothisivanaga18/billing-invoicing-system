import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateTransactionId } from '../utils/helpers';

export async function getPayments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10', invoiceId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      userId,
      ...(invoiceId && { invoiceId: invoiceId as string }),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          invoice: {
            select: { invoiceNumber: true, totalAmount: true },
          },
          customer: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
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

export async function createStripePaymentIntent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { invoiceId } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { customer: true },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'PAID') {
      res.status(400).json({ error: 'Invoice is already paid' });
      return;
    }

    const { getStripeClient } = await import('../config/stripe');
    const stripe = getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(invoice.totalAmount) * 100),
      currency: invoice.currency.toLowerCase(),
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        userId,
        customerId: invoice.customerId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleStripeWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { getStripeClient } = await import('../config/stripe');
    const stripe = getStripeClient();

    const sig = (req as unknown as { headers: Record<string, string> }).headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !sig) {
      res.status(400).json({ error: 'Missing webhook secret or signature' });
      return;
    }

    const event = stripe.webhooks.constructEvent(
      (req as unknown as { body: Buffer }).body,
      sig,
      webhookSecret
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as {
        id: string;
        amount: number;
        currency: string;
        metadata: {
          invoiceId: string;
          userId: string;
          customerId: string;
        };
      };
      const { invoiceId, userId, customerId } = paymentIntent.metadata;

      const transactionId = generateTransactionId();

      await prisma.$transaction([
        prisma.payment.create({
          data: {
            invoiceId,
            userId,
            customerId,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            paymentMethod: 'STRIPE',
            status: 'COMPLETED',
            transactionId,
            stripePaymentId: paymentIntent.id,
          },
        }),
        prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID', paidAt: new Date() },
        }),
      ]);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

export async function createRazorpayOrder(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { invoiceId } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (invoice.status === 'PAID') {
      res.status(400).json({ error: 'Invoice is already paid' });
      return;
    }

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(invoice.totalAmount) * 100),
      currency: invoice.currency,
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice.id,
        userId,
      },
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    next(error);
  }
}

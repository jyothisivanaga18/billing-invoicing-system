import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  company: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
  taxRate: z.number().min(0).max(100).default(0),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().cuid('Invalid customer ID'),
  dueDate: z.string().datetime('Invalid due date'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discountAmount: z.number().nonnegative().default(0),
  currency: z.string().length(3).default('USD'),
  notes: z.string().max(2000).optional(),
  terms: z.string().max(2000).optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: z
    .enum(['DRAFT', 'SENT', 'VIEWED', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'])
    .optional(),
});

export const createCustomerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2).max(200),
  company: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  taxId: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createPaymentSchema = z.object({
  invoiceId: z.string().cuid('Invalid invoice ID'),
  paymentMethod: z.enum(['STRIPE', 'RAZORPAY', 'PAYPAL', 'BANK_TRANSFER', 'CASH', 'CHEQUE']),
  amount: z.number().positive('Amount must be positive'),
  notes: z.string().max(1000).optional(),
});

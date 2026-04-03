import { v4 as uuidv4 } from 'uuid';

export function generateInvoiceNumber(prefix = 'INV'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}${month}-${random}`;
}

export function generateTransactionId(): string {
  return `TXN-${uuidv4().replace(/-/g, '').toUpperCase().slice(0, 16)}`;
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateInvoiceTotals(
  items: Array<{
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }>,
  discountAmount = 0
): {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.taxRate / 100),
    0
  );
  const totalAmount = subtotal + taxAmount - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > new Date(dueDate);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

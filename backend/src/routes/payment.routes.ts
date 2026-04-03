import { Router } from 'express';
import {
  getPayments,
  createStripePaymentIntent,
  handleStripeWebhook,
  createRazorpayOrder,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Stripe webhook requires raw body - must be before json parsing
router.post('/webhook/stripe', handleStripeWebhook);

router.use(authenticate);

router.get('/', getPayments);
router.post('/stripe/intent', createStripePaymentIntent);
router.post('/razorpay/order', createRazorpayOrder);

export default router;

import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getProfile);

export default router;

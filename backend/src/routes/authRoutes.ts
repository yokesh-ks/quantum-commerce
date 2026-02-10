import * as express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .exists()
      .withMessage('Password is required')
  ],
  login
);

export default router;
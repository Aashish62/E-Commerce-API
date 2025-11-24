
import { body, param, query } from 'express-validator';

export const signupValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('name').optional().isString(),
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').exists()
];

export const categoryValidator = [
  body('name').isString().notEmpty().withMessage('Name required'),
  body('description').optional().isString()
];

export const productCreateValidator = [
  body('name').isString().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('categoryId').optional().isInt()
];

export const addToCartValidator = [
  body('productId').isInt().withMessage('productId required'),
  body('quantity').optional().isInt({ min: 1 })
];

export const productListValidator = [
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('categoryId').optional().isInt(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 })
];

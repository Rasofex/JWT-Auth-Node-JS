import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Please enter a valid image URL'),
];

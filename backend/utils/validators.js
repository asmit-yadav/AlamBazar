import { body, validationResult } from 'express-validator';

/**
 * Validation result middleware
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        errors: errors.array()
      }
    });
  }
  next();
};

/**
 * Login validation rules
 */
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

/**
 * Car creation/update validation rules
 */
export const carValidation = [
  body('brand')
    .notEmpty()
    .withMessage('Brand is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be between 2 and 50 characters'),
  body('model')
    .notEmpty()
    .withMessage('Model is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Model must be between 1 and 100 characters'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid year is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Valid price is required'),
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('fuelType')
    .isIn(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'])
    .withMessage('Valid fuel type is required'),
  body('transmission')
    .isIn(['Manual', 'Automatic'])
    .withMessage('Valid transmission type is required'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Color must be less than 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
];

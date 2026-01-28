import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { carValidation, validate } from '../utils/validators.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar
} from '../services/carService.js';

const router = express.Router();

/**
 * GET /api/cars
 * Get all cars with optional filters and pagination
 * Query params: brand, fuelType, transmission, minPrice, maxPrice, minYear, maxYear, limit, offset
 */
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    brand: req.query.brand,
    fuelType: req.query.fuelType,
    transmission: req.query.transmission,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    minYear: req.query.minYear,
    maxYear: req.query.maxYear
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0
  };

  // Remove undefined filters
  Object.keys(filters).forEach(key => {
    if (filters[key] === undefined) {
      delete filters[key];
    }
  });

  const result = await getAllCars(filters, pagination);

  res.json({
    success: true,
    data: result
  });
}));

/**
 * GET /api/cars/:id
 * Get a single car by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await getCarById(id);

  if (!car) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Car not found'
      }
    });
  }

  res.json({
    success: true,
    data: car
  });
}));

/**
 * POST /api/cars
 * Create a new car (Protected route)
 */
router.post('/', authenticate, carValidation, validate, asyncHandler(async (req, res) => {
  const carData = {
    brand: req.body.brand,
    model: req.body.model,
    year: parseInt(req.body.year),
    price: parseFloat(req.body.price),
    mileage: req.body.mileage ? parseFloat(req.body.mileage) : null,
    fuelType: req.body.fuelType,
    transmission: req.body.transmission,
    color: req.body.color || null,
    description: req.body.description || null,
    images: req.body.images || []
  };

  const newCar = await addCar(carData);

  res.status(201).json({
    success: true,
    message: 'Car added successfully',
    data: newCar
  });
}));

/**
 * PUT /api/cars/:id
 * Update a car (Protected route)
 */
router.put('/:id', authenticate, carValidation, validate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const carData = {
    brand: req.body.brand,
    model: req.body.model,
    year: parseInt(req.body.year),
    price: parseFloat(req.body.price),
    mileage: req.body.mileage ? parseFloat(req.body.mileage) : null,
    fuelType: req.body.fuelType,
    transmission: req.body.transmission,
    color: req.body.color || null,
    description: req.body.description || null,
    images: req.body.images || []
  };

  const updatedCar = await updateCar(id, carData);

  res.json({
    success: true,
    message: 'Car updated successfully',
    data: updatedCar
  });
}));

/**
 * DELETE /api/cars/:id
 * Delete a car (Protected route)
 */
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteCar(id);

  res.json({
    success: true,
    message: 'Car deleted successfully'
  });
}));

export default router;

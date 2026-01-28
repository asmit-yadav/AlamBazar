import { db } from '../config/firebaseAdmin.js';

const CARS_COLLECTION = 'cars';

/**
 * Add a new car to Firestore
 * @param {Object} carData - Car data object
 * @returns {Promise<Object>} Created car with ID
 */
export const addCar = async (carData) => {
  try {
    const car = {
      ...carData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(CARS_COLLECTION).add(car);
    
    return {
      id: docRef.id,
      ...car
    };
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

/**
 * Get all cars with optional filters
 * @param {Object} filters - Filter options (brand, fuelType, etc.)
 * @param {Object} pagination - Pagination options (limit, offset)
 * @returns {Promise<Object>} Cars array and total count
 */
export const getAllCars = async (filters = {}, pagination = {}) => {
  try {
    let query = db.collection(CARS_COLLECTION);

    // Apply filters
    if (filters.brand) {
      query = query.where('brand', '==', filters.brand);
    }
    if (filters.fuelType) {
      query = query.where('fuelType', '==', filters.fuelType);
    }
    if (filters.transmission) {
      query = query.where('transmission', '==', filters.transmission);
    }
    if (filters.minPrice !== undefined) {
      query = query.where('price', '>=', parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      query = query.where('price', '<=', parseFloat(filters.maxPrice));
    }
    if (filters.minYear !== undefined) {
      query = query.where('year', '>=', parseInt(filters.minYear));
    }
    if (filters.maxYear !== undefined) {
      query = query.where('year', '<=', parseInt(filters.maxYear));
    }

    // Get total count (before pagination)
    const countSnapshot = await query.get();
    const total = countSnapshot.size;

    // Apply pagination
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;

    // Order by createdAt (newest first)
    query = query.orderBy('createdAt', 'desc');

    if (offset > 0) {
      const offsetSnapshot = await query.limit(offset).get();
      const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      cars,
      total,
      limit,
      offset,
      hasMore: offset + cars.length < total
    };
  } catch (error) {
    console.error('Error getting cars:', error);
    throw error;
  }
};

/**
 * Get a single car by ID
 * @param {string} carId - Car document ID
 * @returns {Promise<Object|null>} Car object or null if not found
 */
export const getCarById = async (carId) => {
  try {
    const doc = await db.collection(CARS_COLLECTION).doc(carId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting car by ID:', error);
    throw error;
  }
};

/**
 * Update a car
 * @param {string} carId - Car document ID
 * @param {Object} carData - Updated car data
 * @returns {Promise<Object>} Updated car
 */
export const updateCar = async (carId, carData) => {
  try {
    const carRef = db.collection(CARS_COLLECTION).doc(carId);
    
    // Check if car exists
    const carDoc = await carRef.get();
    if (!carDoc.exists) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData = {
      ...carData,
      updatedAt: new Date()
    };

    await carRef.update(updateData);

    const updatedDoc = await carRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

/**
 * Delete a car
 * @param {string} carId - Car document ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteCar = async (carId) => {
  try {
    const carRef = db.collection(CARS_COLLECTION).doc(carId);
    
    // Check if car exists
    const carDoc = await carRef.get();
    if (!carDoc.exists) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }

    await carRef.delete();
    return true;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};

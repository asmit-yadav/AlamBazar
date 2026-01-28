import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadMultipleImages, uploadImage } from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter - only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files
  }
});

/**
 * POST /api/upload/images
 * Upload multiple images to Cloudinary (Protected route)
 * Accepts: multipart/form-data with 'images' field (array of files)
 */
router.post(
  '/images',
  authenticate,
  upload.array('images', 10), // 'images' is the field name, max 10 files
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No images provided. Please upload at least one image.'
        }
      });
    }

    try {
      // Convert files to buffers for Cloudinary
      const fileBuffers = req.files.map(file => file.buffer);

      // Upload options
      const uploadOptions = {
        folder: 'alambazar/cars',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
        ]
      };

      // Upload all images to Cloudinary
      const uploadResults = await uploadMultipleImages(fileBuffers, uploadOptions);

      // Extract URLs and public IDs
      const imageData = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }));

      res.json({
        success: true,
        message: `${imageData.length} image(s) uploaded successfully`,
        data: {
          images: imageData
        }
      });
    } catch (error) {
      console.error('Image upload error:', error);
      
      if (error.http_code) {
        return res.status(error.http_code).json({
          success: false,
          error: {
            message: 'Image upload failed',
            details: error.message
          }
        });
      }

      throw error;
    }
  })
);

/**
 * POST /api/upload/single
 * Upload single image to Cloudinary (Protected route)
 * Accepts: multipart/form-data with 'image' field
 */
router.post(
  '/single',
  authenticate,
  upload.single('image'), // 'image' is the field name
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No image provided'
        }
      });
    }

    try {
      const uploadOptions = {
        folder: 'alambazar/cars',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
        ]
      };

      const result = await uploadImage(req.file.buffer, uploadOptions);

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        }
      });
    } catch (error) {
      console.error('Single image upload error:', error);
      
      if (error.http_code) {
        return res.status(error.http_code).json({
          success: false,
          error: {
            message: 'Image upload failed',
            details: error.message
          }
        });
      }

      throw error;
    }
  })
);

export default router;

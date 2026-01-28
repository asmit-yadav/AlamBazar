/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Firebase Admin errors
  if (err.code && err.code.startsWith('auth/')) {
    statusCode = 401;
    message = 'Authentication failed';
  }

  // Firestore errors
  if (err.code === 'permission-denied') {
    statusCode = 403;
    message = 'Permission denied';
  }

  // Cloudinary errors
  if (err.http_code) {
    statusCode = err.http_code;
    message = err.message || 'Image upload failed';
  }

  // Validation errors
  if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors || [err.message];
  }

  // Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else {
      message = 'File upload error';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

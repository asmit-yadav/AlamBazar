import { auth } from '../config/firebaseAdmin.js';
import { asyncHandler } from './errorHandler.js';

/**
 * Authentication middleware
 * Verifies Firebase ID token from Authorization header
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided. Please include Bearer token in Authorization header'
        }
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token format'
        }
      });
    }

    // Verify token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired. Please login again'
        }
      });
    }

    if (error.code === 'auth/id-token-revoked' || error.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token. Please login again'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication failed'
      }
    });
  }
});

/**
 * Optional authentication middleware
 * Doesn't fail if token is missing, but verifies if provided
 */
export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified
        };
      }
    }
    
    next();
  } catch (error) {
    // If optional auth fails, just continue without user
    next();
  }
});

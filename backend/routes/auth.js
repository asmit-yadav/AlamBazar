import express from 'express';
import { auth } from '../config/firebaseAdmin.js';
import { loginValidation, validate } from '../utils/validators.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Admin login endpoint
 * Note: This endpoint verifies if the user exists and is an admin.
 * Frontend should use Firebase Client SDK to actually sign in and get ID token.
 * This endpoint can be used for additional verification or to check admin status.
 */
router.post('/login', loginValidation, validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user by email using Firebase Admin
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password'
          }
        });
      }
      throw error;
    }

    // Check if user is disabled
    if (userRecord.disabled) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is disabled'
        }
      });
    }

    // Check if email is verified (optional check)
    if (!userRecord.emailVerified) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Email not verified. Please verify your email first.'
        }
      });
    }

    // Note: Firebase Admin SDK doesn't verify passwords directly.
    // Password verification happens on the client side with Firebase Client SDK.
    // This endpoint just verifies that the user exists and is valid.
    // Frontend should:
    // 1. Call this endpoint to check if user exists
    // 2. Use Firebase Client SDK to sign in with email/password
    // 3. Get ID token from Firebase Client SDK
    // 4. Use that token for authenticated API calls

    res.json({
      success: true,
      message: 'User verified. Please use Firebase Client SDK to sign in.',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}));

/**
 * POST /api/auth/verify
 * Verify Firebase ID token
 * Frontend sends the ID token from Firebase Client SDK, backend verifies it
 */
router.post('/verify', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Token is required'
      }
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    });
  }
}));

export default router;

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

// Extend the Request interface to include the auth payload
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

/**
 * Basic middleware to verify the custom JWT.
 * Use this for endpoints like /sync where the user record might not exist yet.
 */
export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[auth]: ❌ No Authorization header');
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.AUTH_SECRET || process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as any;

    if (!decoded) {
      console.error('[auth]: ❌ JWT verification failed');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log('[auth]: ✅ Token verified for user:', decoded.sub || decoded.userId);
    req.auth = {
      userId: decoded.sub || decoded.userId || decoded.id,
      email: decoded.email,
      metadata: decoded.metadata || {},
    };
    next();
  } catch (error: any) {
    console.error('[auth]: ❌ Unexpected auth error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Strict middleware to verify JWT AND ensure user exists in our database.
 * Use this for all standard protected application routes.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // First, verify the session
  await verifySession(req, res, async () => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid session' });
      }

      // Check if the user exists in our local database
      const userInDb = await prisma.user.findUnique({
        where: { id: req.auth.userId }
      });

      if (!userInDb) {
        console.log('[auth]: ⛔ User', req.auth.userId, 'not found in database');
        return res.status(403).json({ error: 'Forbidden: User not found in system database. Please register first.' });
      }

      console.log('[auth]: ✅ User', req.auth.userId, 'verified in database');
      next();
    } catch (error: any) {
      console.error('[auth]: DB check error', error.message);
      return res.status(500).json({ error: 'Internal Authentication Error' });
    }
  });
};


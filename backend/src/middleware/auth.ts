import { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

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
 * Basic middleware to verify the Supabase JWT via Supabase's own API.
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
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('[auth]: ❌ Supabase token verification failed:', error?.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log('[auth]: ✅ Token verified for user:', user.id);
    req.auth = {
      userId: user.id,
      email: user.email,
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
  // First, verify the session via Supabase
  await verifySession(req, res, async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid session' });
      }

      // Check if the user exists in our local database
      const userInDb = await prisma.user.findUnique({
        where: { supabaseId: req.auth.userId }
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

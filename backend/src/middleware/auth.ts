import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { getAuthSecret } from '../lib/auth';

// Extend the Request interface to include the auth payload
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email?: string;
        jti?: string;
        isOnboarded?: boolean;
        [key: string]: any;
      };
    }
  }
}

/**
 * Verifies the HS256 JWT signature, expiry, and server-side Session record (when jti is present).
 */
export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  try {
    const secret = getAuthSecret();
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as jwt.JwtPayload;

    const userId =
      (typeof decoded.userId === 'string' && decoded.userId) ||
      (typeof decoded.sub === 'string' && decoded.sub) ||
      (typeof decoded.id === 'string' && decoded.id) ||
      null;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    const jti = typeof decoded.jti === 'string' ? decoded.jti : undefined;

    // Enforce server-side session revocation for all tokens issued with a session jti
    if (jti) {
      const activeSession = await prisma.session.findUnique({
        where: { sessionToken: jti },
      });

      if (!activeSession || activeSession.userId !== userId || activeSession.expires <= new Date()) {
        return res.status(401).json({ error: 'Unauthorized: Session expired or revoked' });
      }
    }

    req.auth = {
      userId,
      email: typeof decoded.email === 'string' ? decoded.email : undefined,
      jti,
      isOnboarded: typeof decoded.isOnboarded === 'boolean' ? decoded.isOnboarded : undefined,
      metadata: decoded.metadata || {},
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

/**
 * Strict middleware to verify JWT, active session, AND user existence in database.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  await verifySession(req, res, async () => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid session' });
      }

      const userInDb = await prisma.user.findUnique({
        where: { id: req.auth.userId },
        select: { id: true, isOnboarded: true },
      });

      if (!userInDb) {
        return res.status(403).json({
          error: 'Forbidden: User account not found. Please register or sign in again.',
        });
      }

      req.auth.isOnboarded = userInDb.isOnboarded;
      next();
    } catch (error: any) {
      console.error('[auth]: DB check error', error?.message);
      return res.status(500).json({ error: 'Internal Authentication Error' });
    }
  });
};

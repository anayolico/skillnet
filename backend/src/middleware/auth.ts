import { clerkMiddleware, getAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to require authentication for specific routes.
 * If the user is not authenticated, Clerk handles the unauthorized response.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

export { clerkMiddleware, getAuth };

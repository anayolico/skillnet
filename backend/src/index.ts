import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, getAuth, requireAuth } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Initialize Clerk

/**
 * @api {get} /health Liveness probe
 * Returns 200 if the server is running.
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @api {get} /ready Readiness probe
 * Returns 200 if the server and database are both reachable.
 */
app.get('/ready', async (req: Request, res: Response) => {
  try {
    // Attempt a simple query to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      ready: true,
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[database]: Connection failed', error);
    res.status(503).json({
      ready: false,
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('SkillNet Backend API is running');
});

/**
 * @api {get} /me Get current authenticated user
 * Protected route example
 */
app.get('/me', requireAuth, (req: Request, res: Response) => {
  const auth = getAuth(req);
  res.json({
    userId: auth.userId,
    message: 'Hello from protected route!'
  });
});

// Start server
app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  
  // Test database connection on startup
  try {
    await prisma.$connect();
    console.log('[database]: Connected successfully to Neon PostgreSQL');
  } catch (error) {
    console.error('[database]: Failed to connect to database at startup', error);
  }
});

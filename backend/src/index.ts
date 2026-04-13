import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { requireAuth, verifySession } from './middleware/auth';
import { supabaseWebhookHandler } from './webhooks/supabase';
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());

// Request logging - logs every incoming request
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Supabase webhook endpoint
app.post('/api/webhooks/supabase', express.json(), supabaseWebhookHandler);

app.use(express.json());

/**
 * @api {post} /api/auth/sync Sync frontend user to database
 */
app.post('/api/auth/sync', verifySession, async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  const email = req.auth?.email;
  const metadata = req.body.metadata || {};

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing user credentials in token' });
  }

  try {
    const user = await prisma.user.upsert({
      where: { supabaseId: userId },
      update: { email },
      create: {
        supabaseId: userId,
        email,
        firstName: metadata.full_name?.split(' ')[0] || metadata.first_name || '',
        lastName: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.last_name || '',
        imageUrl: metadata.avatar_url || metadata.image_url || null,
      }
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('[database]: Error syncing user via API', error);
    res.status(500).json({ error: 'Database sync failed' });
  }
});
/**
 * @api {get} /api/auth/verify Verify user existence in DB and return onboarding status
 */
app.get('/api/auth/verify', requireAuth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { supabaseId: req.auth!.userId },
    select: { isOnboarded: true }
  });
  res.status(200).json({ success: true, userId: req.auth?.userId, isOnboarded: user?.isOnboarded ?? false });
});

/**
 * @api {post} /api/onboarding Complete onboarding and create user profile
 */
app.post('/api/onboarding', requireAuth, async (req: Request, res: Response) => {
  const { headline, bio, skillsOffered, skillsSought, experienceLevel, availability, timezone } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.auth!.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name if provided
    const { firstName, lastName } = req.body;

    await prisma.$transaction([
      // Create or update the profile
      prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          headline,
          bio,
          skillsOffered: skillsOffered || [],
          skillsSought: skillsSought || [],
          experienceLevel,
          availability,
          timezone,
        },
        create: {
          userId: user.id,
          headline,
          bio,
          skillsOffered: skillsOffered || [],
          skillsSought: skillsSought || [],
          experienceLevel,
          availability,
          timezone,
        }
      }),
      // Mark the user as onboarded and update name
      prisma.user.update({
        where: { id: user.id },
        data: {
          isOnboarded: true,
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        }
      })
    ]);

    console.log(`[onboarding]: ✅ User ${user.id} completed onboarding`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[onboarding]: Error', error);
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

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
 * @api {get} /api/me Get current authenticated user and profile
 */
app.get('/api/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.auth!.userId },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User records not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('[me]: Error fetching user profile', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
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

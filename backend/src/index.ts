import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { requireAuth, verifySession } from './middleware/auth';
import { supabaseWebhookHandler } from './webhooks/supabase';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
 * @api {post} /api/auth/logout Logout endpoint
 * In a stateless JWT system, the client handles logout by deleting the token.
 * This endpoint provides a hook for future server-side session cleanup.
 */
app.post('/api/auth/logout', requireAuth, async (req: Request, res: Response) => {
  // Logic for token blacklisting or session termination would go here
  res.status(200).json({ success: true, message: 'Logged out successfully' });
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

/**
 * @api {get} /api/marketplace/partners Retrieve user profiles for discovery
 */
app.get('/api/marketplace/partners', requireAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // First get the caller's internal user ID
    const caller = await prisma.user.findUnique({
      where: { supabaseId: req.auth!.userId }
    });

    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    let whereClause: any = {
      user: {
        isOnboarded: true,
        id: { not: caller.id } // Exclude the requesting user
      }
    };

    if (search) {
      const searchStr = String(search).toLowerCase();
      whereClause.OR = [
        { headline: { contains: searchStr, mode: 'insensitive' } },
        { skillsOffered: { hasSome: [searchStr] } },
        { skillsSought: { hasSome: [searchStr] } }
      ];
    }

    if (category) {
      // Assuming experienceLevel or availability might be category? The prompt doesn't specify deeply.
      // E.g., we'll just check if it matches an experience level or skills since category might be a skill domain.
      whereClause.skillsOffered = { hasSome: [String(category)] };
    }

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, imageUrl: true } }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.profile.count({ where: whereClause });

    res.status(200).json({ success: true, data: profiles, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    console.error('[marketplace]: Error fetching partners', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

/**
 * @api {get} /api/marketplace/stats Retrieve lively marketplace statistics
 */
app.get('/api/marketplace/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const completedSwaps = await prisma.swap.count({ where: { status: 'completed' } });
    const activeSwaps = await prisma.swap.count({ where: { status: 'active' } });
    
    // Total non-cancelled
    const totalSwaps = await prisma.swap.count({ where: { status: { in: ['completed', 'active'] } } });
    const successRate = totalSwaps > 0 ? (completedSwaps / totalSwaps) : 1; 

    // Find unique skills offeered
    const profiles = await prisma.profile.findMany({ select: { skillsOffered: true } });
    const skillsSet = new Set<string>();
    profiles.forEach(p => p.skillsOffered.forEach(skill => skillsSet.add(skill)));

    res.status(200).json({
      success: true,
      stats: {
        completedSwaps,
        activeSwaps,
        uniqueSkillDomains: skillsSet.size,
        successRate
      }
    });
  } catch (error) {
    console.error('[marketplace]: Error fetching stats', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * @api {get} /api/marketplace/listings Retrieve listings with search and filters
 */
app.get('/api/marketplace/listings', requireAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get internal user ID to exclude own listings
    const caller = await prisma.user.findUnique({
      where: { supabaseId: req.auth!.userId }
    });

    let whereClause: any = {
      isActive: true,
      userId: caller ? { not: caller.id } : undefined
    };

    if (search) {
      const searchStr = String(search).toLowerCase();
      whereClause.OR = [
        { title: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { skillsOffered: { hasSome: [searchStr] } },
        { skillsSought: { hasSome: [searchStr] } }
      ];
    }

    if (category) {
      whereClause.category = String(category);
    }

    const [listings, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        include: {
          user: { 
            include: { profile: true }
          }
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.listing.count({ where: whereClause })
    ]);

    res.json({ 
      success: true, 
      data: listings, 
      total, 
      page: pageNum, 
      pages: Math.ceil(total / limitNum) 
    });
  } catch (error) {
    console.error('[marketplace]: Error fetching listings', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

/**
 * @api {post} /api/marketplace/listings Create a listing
 */
app.post('/api/marketplace/listings', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { title, description, skillsOffered, skillsSought, category, sessionFormat, timeValue } = req.body;
    
    const listing = await prisma.listing.create({
      data: {
        userId: caller.id,
        title,
        description,
        skillsOffered: skillsOffered || [],
        skillsSought: skillsSought || [],
        category,
        sessionFormat,
        timeValue
      }
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    console.error('[marketplace]: Error creating listing', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

/**
 * @api {get} /api/marketplace/listings/:id Get a single listing
 */
app.get('/api/marketplace/listings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        user: { 
          select: { firstName: true, lastName: true, imageUrl: true, profile: true } 
        }
      }
    });

    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get listing' });
  }
});

/**
 * @api {put} /api/marketplace/listings/:id Update a listing
 */
app.put('/api/marketplace/listings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    // Ensure ownership
    let listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing || listing.userId !== caller.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: { ...req.body } // For brevity, spreading body
    });

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

/**
 * @api {delete} /api/marketplace/listings/:id Deactivate a listing
 */
app.delete('/api/marketplace/listings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    // Ensure ownership
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing || listing.userId !== caller.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate listing' });
  }
});

/**
 * @api {post} /api/marketplace/swap-requests Create a swap request
 */
app.post('/api/marketplace/swap-requests', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { listingId, message } = req.body;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || !listing.isActive) return res.status(400).json({ error: 'Invalid or inactive listing' });

    if (listing.userId === caller.id) {
      return res.status(400).json({ error: 'Cannot request swap on your own listing' });
    }

    const swapReq = await prisma.swapRequest.create({
      data: {
        listingId: listing.id,
        requesterId: caller.id,
        recipientId: listing.userId,
        message
      }
    });

    res.status(201).json({ success: true, swapRequest: swapReq });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

/**
 * @api {get} /api/marketplace/swap-requests Get swap requests
 */
app.get('/api/marketplace/swap-requests', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const sent = await prisma.swapRequest.findMany({
      where: { requesterId: caller.id },
      include: { listing: true, recipient: { select: { firstName: true, lastName: true, imageUrl: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const received = await prisma.swapRequest.findMany({
      where: { recipientId: caller.id },
      include: { listing: true, requester: { select: { firstName: true, lastName: true, imageUrl: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, sent, received });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swap requests' });
  }
});

/**
 * @api {put} /api/marketplace/swap-requests/:id Update swap request
 */
app.put('/api/marketplace/swap-requests/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { supabaseId: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { status } = req.body; // 'accepted' | 'declined'
    
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const swapReq = await prisma.swapRequest.findUnique({ where: { id: req.params.id } });
    if (!swapReq || swapReq.recipientId !== caller.id) {
      return res.status(403).json({ error: 'Unauthorized or not found' });
    }

    if (swapReq.status !== 'pending') {
      return res.status(400).json({ error: 'Request is already processed' });
    }

    const updated = await prisma.swapRequest.update({
      where: { id: req.params.id },
      data: { status }
    });

    if (status === 'accepted') {
      await prisma.swap.create({
        data: {
          swapRequestId: updated.id,
          participantAId: updated.requesterId,
          participantBId: updated.recipientId
        }
      });
    }

    res.json({ success: true, swapRequest: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update swap request' });
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

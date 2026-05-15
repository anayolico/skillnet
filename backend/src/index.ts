import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';

// Load environment variables as early as possible
dotenv.config();

import { requireAuth, verifySession } from './middleware/auth';
import prisma from './lib/prisma';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Map to track clients in rooms: swapId -> Set of WebSockets
const rooms = new Map<string, Set<WebSocket>>();
const userRooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws: WebSocket) => {
  let currentSwapId: string | null = null;
  let currentUserId: string | null = null;

  ws.on('message', async (data: string) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'join') {
        const { swapId, userId } = message;
        currentSwapId = swapId;
        currentUserId = userId;

        if (!rooms.has(swapId)) {
          rooms.set(swapId, new Set());
        }
        rooms.get(swapId)!.add(ws);
        console.log(`[ws]: User ${userId} joined swap room ${swapId}`);
      }

      if (message.type === 'subscribe') {
        const { userId } = message;
        currentUserId = userId;
        if (!userRooms.has(userId)) {
          userRooms.set(userId, new Set());
        }
        userRooms.get(userId)!.add(ws);
        console.log(`[ws]: User ${userId} subscribed to notifications`);
      }

      if (message.type === 'chat') {
        const { swapId, userId, content } = message;

        // Persist message to DB
        const savedMsg = await prisma.message.create({
          data: {
            swapId,
            senderId: userId,
            content
          }
        });

        // Broadcast to all clients in the room
        const clients = rooms.get(swapId);
        if (clients) {
          const payload = JSON.stringify({
            type: 'chat',
            ...savedMsg
          });
          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(payload);
            }
          });
        }
      }
    } catch (err) {
      console.error('[ws]: Error handling message', err);
    }
  });

  ws.on('close', () => {
    if (currentSwapId && rooms.has(currentSwapId)) {
      rooms.get(currentSwapId)!.delete(ws);
      if (rooms.get(currentSwapId)!.size === 0) {
        rooms.delete(currentSwapId);
      }
    }
    if (currentUserId && userRooms.has(currentUserId)) {
      userRooms.get(currentUserId)!.delete(ws);
      if (userRooms.get(currentUserId)!.size === 0) {
        userRooms.delete(currentUserId);
      }
    }
    console.log(`[ws]: Connection closed for user ${currentUserId}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

/**
 * @api {get} /api/db-check Check database connection status
 */
app.get('/api/db-check', async (req: Request, res: Response) => {
  try {
    // Perform a simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[${new Date().toISOString()}] 🟢 Database connection successful`);
    res.json({ status: 'connected', timestamp: new Date() });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 🔴 Database connection failed:`, error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      timestamp: new Date() 
    });
  }
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @api {post} /api/auth/sync Sync frontend user to database
 */
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
      }
    });

    res.status(201).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('[register] Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @api {post} /api/auth/login Login with credentials
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.AUTH_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    });
  } catch (error) {
    console.error('[login] Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @api {post} /api/auth/google Google OAuth login
 */
app.post('/api/auth/google', async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'postmessage',
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenRes.data;

    // Get user info from Google
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const googleUser = userRes.data;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!user) {
      // Create new user from Google data
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.given_name || '',
          lastName: googleUser.family_name || '',
          imageUrl: googleUser.picture || null,
          emailVerified: new Date(),
          // Generate a random password since it's required
          password: await bcrypt.hash(Math.random().toString(36), 10)
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.AUTH_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    });
  } catch (error: any) {
    console.error('[google-auth] Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

app.post('/api/auth/sync', verifySession, async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  const email = req.auth?.email;
  const metadata = req.body.metadata || {};

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing user credentials in token' });
  }

  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: {
        id: userId,
        email,
        firstName: metadata.full_name?.split(' ')[0] || metadata.first_name || '',
        lastName: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.last_name || '',
        imageUrl: metadata.avatar_url || metadata.image_url || null,
      }
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Database sync failed' });
  }
});

/**
 * @api {get} /api/auth/verify Verify user existence
 */
app.get('/api/auth/verify', verifySession, async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  const email = req.auth?.email;
  const metadata = req.auth?.metadata || {};

  if (!userId || !email) {
    return res.status(400).json({ error: 'Missing user credentials in token' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isOnboarded: true }
    });

    if (!user) {
      console.log(`[auth]: User ${userId} not found in DB during verify, attempting auto-sync`);
      // Auto-sync user
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          firstName: metadata.full_name?.split(' ')[0] || metadata.first_name || '',
          lastName: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.last_name || '',
          imageUrl: metadata.avatar_url || metadata.image_url || null,
        }
      });
      user = { isOnboarded: newUser.isOnboarded };
    }

    res.status(200).json({ success: true, userId: userId, isOnboarded: user.isOnboarded });
  } catch (error) {
    console.error('[auth]: Verify/Auto-sync failed', error);
    res.status(500).json({ error: 'Database verification failed' });
  }
});

/**
 * @api {post} /api/onboarding Complete onboarding
 */
app.post('/api/onboarding', requireAuth, async (req: Request, res: Response) => {
  const { headline, bio, skillsOffered, skillsSought, experienceLevel, availability, timezone } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { firstName, lastName } = req.body;

    await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId: user.id },
        update: { headline, bio, skillsOffered: skillsOffered || [], skillsSought: skillsSought || [], experienceLevel, availability, timezone },
        create: { userId: user.id, headline, bio, skillsOffered: skillsOffered || [], skillsSought: skillsSought || [], experienceLevel, availability, timezone }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { isOnboarded: true, ...(firstName && { firstName }), ...(lastName && { lastName }) }
      })
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

/**
 * @api {get} /api/me Get current user
 */
app.get('/api/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      include: { profile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * @api {get} /api/marketplace/partners Retrieve user profiles
 */
app.get('/api/marketplace/partners', requireAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    let whereClause: any = { user: { isOnboarded: true, id: { not: caller.id } } };

    if (search) {
      const searchStr = String(search).toLowerCase();
      whereClause.OR = [
        { headline: { contains: searchStr, mode: 'insensitive' } },
        { skillsOffered: { hasSome: [searchStr] } },
        { skillsSought: { hasSome: [searchStr] } }
      ];
    }

    if (category) {
      whereClause.skillsOffered = { hasSome: [String(category)] };
    }

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: { user: { select: { firstName: true, lastName: true, imageUrl: true } } },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.profile.count({ where: whereClause });
    res.status(200).json({ success: true, data: profiles, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

/**
 * @api {get} /api/marketplace/stats Retrieve stats
 */
app.get('/api/marketplace/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const completedSwaps = await prisma.swap.count({ where: { status: 'completed' } });
    const activeSwaps = await prisma.swap.count({ where: { status: 'active' } });
    const totalSwaps = await prisma.swap.count({ where: { status: { in: ['completed', 'active'] } } });
    const successRate = totalSwaps > 0 ? (completedSwaps / totalSwaps) : 1;

    const profiles = await prisma.profile.findMany({ select: { skillsOffered: true } });
    const skillsSet = new Set<string>();
    profiles.forEach(p => p.skillsOffered.forEach(skill => skillsSet.add(skill)));

    res.status(200).json({ success: true, stats: { completedSwaps, activeSwaps, uniqueSkillDomains: skillsSet.size, successRate } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * @api {get} /api/marketplace/listings Retrieve listings
 */
app.get('/api/marketplace/listings', requireAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });

    let whereClause: any = { isActive: true, userId: caller ? { not: caller.id } : undefined };

    if (search) {
      const searchStr = String(search).toLowerCase();
      whereClause.OR = [
        { title: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { skillsOffered: { hasSome: [searchStr] } },
        { skillsSought: { hasSome: [searchStr] } }
      ];
    }

    if (category) whereClause.category = String(category);

    const [listings, total] = await prisma.$transaction([
      prisma.listing.findMany({ where: whereClause, include: { user: { include: { profile: true } } }, skip, take: limitNum, orderBy: { createdAt: 'desc' } }),
      prisma.listing.count({ where: whereClause })
    ]);

    res.json({ success: true, data: listings, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

/**
 * @api {post} /api/marketplace/listings Create a listing
 */
app.post('/api/marketplace/listings', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { title, description, skillsOffered, skillsSought, category, sessionFormat, timeValue } = req.body;

    const listing = await prisma.listing.create({
      data: { userId: caller.id, title, description, skillsOffered: skillsOffered || [], skillsSought: skillsSought || [], category, sessionFormat, timeValue }
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

/**
 * @api {post} /api/marketplace/swap-requests Create a swap request
 */
app.post('/api/marketplace/swap-requests', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { listingId, message } = req.body;
    if (!listingId) return res.status(400).json({ error: 'Listing ID is required' });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    });

    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.userId === caller.id) return res.status(400).json({ error: 'Cannot request a swap with yourself' });

    // Check if a request already exists between these users
    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        requesterId: caller.id,
        recipientId: listing.userId,
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You have already sent a swap request to this user' });
    }

    const swapRequest = await prisma.swapRequest.create({
      data: {
        listingId,
        requesterId: caller.id,
        recipientId: listing.userId,
        message,
        status: 'pending'
      }
    });

    // Notify both requester and recipient via WebSocket
    const notifyUser = (userId: string, subType: string) => {
      const clients = userRooms.get(userId);
      if (clients) {
        const payload = JSON.stringify({
          type: 'notification',
          subType,
          data: swapRequest
        });
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    };

    notifyUser(listing.userId, 'swap_request_received');
    notifyUser(caller.id, 'swap_request_sent');

    res.status(201).json({ success: true, swapRequest });
  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

/**
 * @api {get} /api/marketplace/swap-requests Get swap requests
 */
app.get('/api/marketplace/swap-requests', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const sent = await prisma.swapRequest.findMany({
      where: { requesterId: caller.id },
      include: { listing: true, recipient: { select: { firstName: true, lastName: true, imageUrl: true } }, swap: { select: { id: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const received = await prisma.swapRequest.findMany({
      where: { recipientId: caller.id },
      include: { listing: true, requester: { select: { firstName: true, lastName: true, imageUrl: true } }, swap: { select: { id: true } } },
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
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const swapReq = await prisma.swapRequest.findUnique({ where: { id: req.params.id } });
    if (!swapReq || swapReq.recipientId !== caller.id) return res.status(403).json({ error: 'Unauthorized' });

    if (swapReq.status !== 'pending') return res.status(400).json({ error: 'Already processed' });

    const updated = await prisma.swapRequest.update({ where: { id: req.params.id }, data: { status } });

    if (status === 'accepted') {
      // Check if a swap already exists between these two users
      const existingSwap = await prisma.swap.findFirst({
        where: {
          OR: [
            { participantAId: updated.requesterId, participantBId: updated.recipientId },
            { participantAId: updated.recipientId, participantBId: updated.requesterId }
          ]
        }
      });

      if (!existingSwap) {
        await prisma.swap.create({
          data: { swapRequestId: updated.id, participantAId: updated.requesterId, participantBId: updated.recipientId }
        });
      } else {
        console.log(`[swap]: Swap already exists between ${updated.requesterId} and ${updated.recipientId}. Reusing swap ${existingSwap.id}`);
      }
    }

    res.json({ success: true, swapRequest: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update swap request' });
  }
});

/**
 * @api {get} /api/swaps Get user's active swaps
 */
app.get('/api/swaps', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const swaps = await prisma.swap.findMany({
      where: {
        OR: [{ participantAId: caller.id }, { participantBId: caller.id }]
      },
      include: {
        participantA: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
        participantB: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
        swapRequest: { include: { listing: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: swaps });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

/**
 * @api {get} /api/swaps/:id/messages Get chat history
 */
app.get('/api/swaps/:id/messages', requireAuth, async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { swapId: req.params.id },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * @api {get} /api/notifications/counts Get unread counts
 */
app.get('/api/notifications/counts', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    const swapRequests = await prisma.swapRequest.count({
      where: { recipientId: caller.id, status: 'pending', isViewed: false }
    });

    const unreadMessages = await prisma.message.count({
      where: {
        swap: {
          OR: [{ participantAId: caller.id }, { participantBId: caller.id }]
        },
        senderId: { not: caller.id },
        isRead: false
      }
    });

    res.json({ success: true, counts: { swapRequests, messages: unreadMessages } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification counts' });
  }
});

/**
 * @api {post} /api/notifications/mark-swaps-viewed Mark swap requests as viewed
 */
app.post('/api/notifications/mark-swaps-viewed', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    await prisma.swapRequest.updateMany({
      where: { recipientId: caller.id, status: 'pending', isViewed: false },
      data: { isViewed: true }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark swaps as viewed' });
  }
});

/**
 * @api {post} /api/notifications/mark-messages-read/:swapId Mark messages as read
 */
app.post('/api/notifications/mark-messages-read/:swapId', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'Caller not found' });

    await prisma.message.updateMany({
      where: {
        swapId: req.params.swapId,
        senderId: { not: caller.id },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Start server
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

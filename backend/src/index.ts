import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';

// Load environment variables as early as possible
dotenv.config();

import { requireAuth, verifySession } from './middleware/auth';
import prisma from './lib/prisma';
import {
  BCRYPT_ROUNDS,
  DUMMY_PASSWORD_HASH,
  PASSWORD_RESET_EXPIRY_MINUTES,
  PASSWORD_RESET_PREFIX,
  PUBLIC_USER_SELECT,
  SAFE_USER_SELECT,
  createPasswordCooldownData,
  createPasswordResetToken,
  createSessionToken,
  formatPasswordCooldownMessage,
  getAuthSecret,
  getPasswordCooldownUntil,
  hashResetToken,
  normalizeEmail,
  refreshSessionToken,
  revokeAllUserSessions,
  revokeOtherUserSessions,
  revokeSession,
  sanitizeName,
  sanitizeUser,
  validateNewPassword,
  validateRegistrationName,
} from './lib/auth';
import { sendPasswordResetEmail } from './lib/mailer';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

// Fail fast on startup if AUTH_SECRET is missing or too weak
getAuthSecret();

const app = express();
app.set('trust proxy', 1);
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

// Security Headers
app.use(helmet());

// Strict CORS Allowlist
const normalizedFrontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, '');
const allowedOrigins = new Set(
  [
    normalizedFrontendUrl,
    'https://skillnets.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
  ].filter(Boolean) as string[]
);

const allowedGoogleRedirectUris = new Set(
  [
    process.env.GOOGLE_REDIRECT_URI,
    normalizedFrontendUrl ? `${normalizedFrontendUrl}/api/auth/google/callback` : undefined,
    'https://skillnets.vercel.app/api/auth/google/callback',
    'http://localhost:3000/api/auth/google/callback',
    'http://127.0.0.1:3000/api/auth/google/callback',
  ].filter(Boolean) as string[]
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser / server-to-server requests (webhooks, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'verif-hash'],
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Rate Limiting
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes and try again.' },
});

const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Please wait 15 minutes and try again.' },
});

app.use('/api', apiRateLimiter);

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
 * @api {get} /health Liveness probe
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @api {get} /ready Readiness probe (checks DB)
 */
app.get('/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      ready: true,
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
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
 * @api {post} /api/auth/register Create a new email/password account
 */
app.post('/api/auth/register', authRateLimiter, async (req: Request, res: Response) => {
  const nameCheck = validateRegistrationName(req.body?.firstName, req.body?.lastName);
  const email = normalizeEmail(req.body?.email);
  const passwordCheck = validateNewPassword(req.body?.password);
  const confirmPassword = req.body?.confirmPassword;

  if (!nameCheck.valid) {
    return res.status(400).json({ error: nameCheck.error });
  }

  if (!email) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!passwordCheck.valid) {
    return res.status(400).json({ error: passwordCheck.error });
  }

  if (confirmPassword !== undefined && confirmPassword !== passwordCheck.value) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please log in or continue with Google.',
      });
    }

    const hashedPassword = await bcrypt.hash(passwordCheck.value, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: nameCheck.firstName,
        lastName: nameCheck.lastName,
      },
      select: SAFE_USER_SELECT,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    console.error('[register] Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @api {post} /api/auth/login Login with email and password
 */
app.post('/api/auth/login', authRateLimiter, async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;

  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Valid email and password are required' });
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(401).json({
      error: 'Invalid email or password. If you signed up with Google, click Continue with Google.',
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Constant-time password comparison prevents timing-based email enumeration
    const hashToCompare = user?.password || DUMMY_PASSWORD_HASH;
    const isValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.password || !isValid) {
      return res.status(401).json({
        error: 'Invalid email or password. If you signed up with Google, click Continue with Google.',
      });
    }

    const { token } = await createSessionToken({
      id: user.id,
      email: user.email,
      isOnboarded: user.isOnboarded,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        isOnboarded: user.isOnboarded,
        subscriptionTier: user.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('[login] Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @api {post} /api/auth/google Google OAuth 2.0 (with PKCE + verified_email + Account linking)
 */
app.post('/api/auth/google', authRateLimiter, async (req: Request, res: Response) => {
  const { code, codeVerifier, redirectUri } = req.body || {};

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  const resolvedRedirectUri =
    typeof redirectUri === 'string' && redirectUri.trim()
      ? redirectUri.trim()
      : process.env.GOOGLE_REDIRECT_URI || '';

  if (!resolvedRedirectUri || !allowedGoogleRedirectUris.has(resolvedRedirectUri)) {
    return res.status(400).json({ error: 'Invalid OAuth redirect URI' });
  }

  try {
    // Exchange authorization code for Google OAuth tokens
    const params = new URLSearchParams();
    params.append('code', code.trim());
    params.append('client_id', process.env.GOOGLE_CLIENT_ID || '');
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET || '');
    params.append('redirect_uri', resolvedRedirectUri);
    params.append('grant_type', 'authorization_code');
    if (typeof codeVerifier === 'string' && codeVerifier.trim()) {
      params.append('code_verifier', codeVerifier.trim());
    }

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    const { access_token, id_token, token_type, scope } = tokenRes.data;

    // Fetch authenticated Google profile
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 10000,
    });

    const googleUser = userRes.data;
    const providerAccountId = googleUser?.id ? String(googleUser.id) : null;
    const normalizedEmail = normalizeEmail(googleUser?.email);

    if (!providerAccountId || !normalizedEmail || googleUser?.verified_email !== true) {
      return res.status(400).json({
        error: 'A verified Google email address is required to sign in.',
      });
    }

    const googleFirstName = sanitizeName(googleUser.given_name);
    const googleLastName = sanitizeName(googleUser.family_name);
    const googlePicture =
      typeof googleUser.picture === 'string' && googleUser.picture.startsWith('https://')
        ? googleUser.picture
        : null;

    // 1. Prefer an existing verified Google Account link
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = existingAccount?.user || null;

    if (user) {
      // Backfill missing name/avatar fields without overwriting custom user edits
      const updates: Record<string, any> = {};
      if (!user.firstName && googleFirstName) updates.firstName = googleFirstName;
      if (!user.lastName && googleLastName) updates.lastName = googleLastName;
      if (!user.imageUrl && googlePicture) updates.imageUrl = googlePicture;
      if (!user.emailVerified) updates.emailVerified = new Date();

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    } else {
      // 2. Check for existing account by normalized email
      const existingByEmail = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingByEmail) {
        // Brand-new Google user: no fake random password; link Account atomically
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            firstName: googleFirstName,
            lastName: googleLastName,
            imageUrl: googlePicture,
            emailVerified: new Date(),
            password: null,
            accounts: {
              create: {
                type: 'oauth',
                provider: 'google',
                providerAccountId,
                token_type: token_type || null,
                scope: scope || null,
                id_token: id_token || null,
              },
            },
          },
        });
      } else {
        // Pre-Account Takeover Defense: if a prior form signup never verified this email,
        // revoke its unverified password and sessions when the real verified Google owner claims it.
        const wasUnverifiedPasswordAccount =
          !existingByEmail.emailVerified && Boolean(existingByEmail.password);

        if (wasUnverifiedPasswordAccount) {
          await revokeAllUserSessions(existingByEmail.id);
        }

        const [updatedUser] = await prisma.$transaction([
          prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
              emailVerified: existingByEmail.emailVerified || new Date(),
              ...(wasUnverifiedPasswordAccount ? { password: null } : {}),
              ...(!existingByEmail.firstName && googleFirstName
                ? { firstName: googleFirstName }
                : {}),
              ...(!existingByEmail.lastName && googleLastName
                ? { lastName: googleLastName }
                : {}),
              ...(!existingByEmail.imageUrl && googlePicture ? { imageUrl: googlePicture } : {}),
            },
          }),
          prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId,
              },
            },
            update: {
              token_type: token_type || null,
              scope: scope || null,
              id_token: id_token || null,
            },
            create: {
              userId: existingByEmail.id,
              type: 'oauth',
              provider: 'google',
              providerAccountId,
              token_type: token_type || null,
              scope: scope || null,
              id_token: id_token || null,
            },
          }),
        ]);

        user = updatedUser;
      }
    }

    const { token } = await createSessionToken({
      id: user.id,
      email: user.email,
      isOnboarded: user.isOnboarded,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        isOnboarded: user.isOnboarded,
        subscriptionTier: user.subscriptionTier,
      },
    });
  } catch (error: any) {
    console.error('[google-auth] Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

/**
 * @api {post} /api/auth/logout Revoke current server-side session
 */
app.post('/api/auth/logout', verifySession, async (req: Request, res: Response) => {
  try {
    await revokeSession(req.auth?.jti);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[logout] Error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * @api {post} /api/auth/change-password Change (or set) password for authenticated user
 */
app.post('/api/auth/change-password', authRateLimiter, requireAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  const passwordCheck = validateNewPassword(newPassword);
  if (!passwordCheck.valid) {
    return res.status(400).json({ error: passwordCheck.error });
  }

  if (typeof confirmPassword !== 'string' || confirmPassword !== passwordCheck.value) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    // Enforce 7-day password change cooldown (applies after any change or reset)
    const cooldownUntil = await getPasswordCooldownUntil(user.id);
    if (cooldownUntil) {
      return res.status(429).json({
        error: formatPasswordCooldownMessage(cooldownUntil),
        passwordCooldownUntil: cooldownUntil.toISOString(),
      });
    }

    if (user.password) {
      if (typeof currentPassword !== 'string' || !currentPassword) {
        return res.status(400).json({ error: 'Please enter your current password.' });
      }
      if (Buffer.byteLength(currentPassword, 'utf8') > 72) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      if (currentPassword === passwordCheck.value) {
        return res.status(400).json({
          error: 'New password must be different from your current password.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(passwordCheck.value, BCRYPT_ROUNDS);
    const cooldownData = createPasswordCooldownData(user.id);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: cooldownData.identifier },
      }),
      prisma.verificationToken.create({
        data: cooldownData,
      }),
    ]);

    // Revoke all other sessions on other devices while keeping the current session signed in
    await revokeOtherUserSessions(user.id, req.auth?.jti);

    res.status(200).json({
      success: true,
      hasPassword: true,
      passwordCooldownUntil: cooldownData.expires.toISOString(),
      message: user.password
        ? 'Password updated successfully.'
        : 'Password set successfully. You can now sign in with email or Google.',
    });
  } catch (error) {
    console.error('[change-password] Error:', error);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

/**
 * @api {post} /api/auth/forgot-password Request an expiring password reset link (non-enumerating)
 */
app.post('/api/auth/forgot-password', forgotPasswordRateLimiter, async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body?.email);

  if (!email) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const genericResponse = {
    success: true,
    message:
      'If an account with that email exists, we have sent a password reset link. Please check your inbox and spam folder.',
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true },
    });

    if (user && user.email) {
      // Respect the 7-day password change cooldown silently (still returns neutral 200)
      const cooldownUntil = await getPasswordCooldownUntil(user.id);
      if (!cooldownUntil) {
        const rawToken = await createPasswordResetToken(user.email);

        const requestOrigin =
          typeof req.headers.origin === 'string' ? req.headers.origin.replace(/\/+$/, '') : '';
        const resetBaseUrl =
          (requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : null) ||
          normalizedFrontendUrl ||
          'http://localhost:3000';

        const resetUrl = `${resetBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

        await sendPasswordResetEmail({
          to: user.email,
          firstName: user.firstName,
          resetUrl,
          expiresInMinutes: PASSWORD_RESET_EXPIRY_MINUTES,
        });
      }
    }

    // Always return the exact same neutral response to prevent email enumeration
    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('[forgot-password] Error:', error);
    return res.status(200).json(genericResponse);
  }
});

/**
 * @api {get} /api/auth/reset-password/validate Check whether a password reset token is valid & unexpired
 */
app.get('/api/auth/reset-password/validate', authRateLimiter, async (req: Request, res: Response) => {
  const rawToken = typeof req.query.token === 'string' ? req.query.token.trim() : '';

  if (!rawToken || !/^[a-f0-9]{64}$/i.test(rawToken)) {
    return res.status(400).json({
      valid: false,
      error: 'This password reset link is invalid or has expired.',
    });
  }

  try {
    const tokenHash = hashResetToken(rawToken);
    const record = await prisma.verificationToken.findUnique({
      where: { token: tokenHash },
    });

    if (
      !record ||
      !record.identifier.startsWith(PASSWORD_RESET_PREFIX) ||
      record.expires <= new Date()
    ) {
      return res.status(400).json({
        valid: false,
        error: 'This password reset link is invalid or has expired.',
      });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('[reset-password/validate] Error:', error);
    return res.status(500).json({ valid: false, error: 'Unable to verify reset link.' });
  }
});

/**
 * @api {post} /api/auth/reset-password Consume single-use token and set a new password
 */
app.post('/api/auth/reset-password', authRateLimiter, async (req: Request, res: Response) => {
  const { token: rawToken, newPassword, confirmPassword } = req.body || {};

  if (typeof rawToken !== 'string' || !/^[a-f0-9]{64}$/i.test(rawToken.trim())) {
    return res.status(400).json({ error: 'This password reset link is invalid or has expired.' });
  }

  const passwordCheck = validateNewPassword(newPassword);
  if (!passwordCheck.valid) {
    return res.status(400).json({ error: passwordCheck.error });
  }

  if (typeof confirmPassword !== 'string' || confirmPassword !== passwordCheck.value) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const tokenHash = hashResetToken(rawToken.trim());
    const record = await prisma.verificationToken.findUnique({
      where: { token: tokenHash },
    });

    if (
      !record ||
      !record.identifier.startsWith(PASSWORD_RESET_PREFIX) ||
      record.expires <= new Date()
    ) {
      return res.status(400).json({
        error: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    const email = record.identifier.slice(PASSWORD_RESET_PREFIX.length);
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      await prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } });
      return res.status(400).json({
        error: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Enforce 7-day password change cooldown
    const cooldownUntil = await getPasswordCooldownUntil(user.id);
    if (cooldownUntil) {
      return res.status(429).json({
        error: formatPasswordCooldownMessage(cooldownUntil),
        passwordCooldownUntil: cooldownUntil.toISOString(),
      });
    }

    const hashedPassword = await bcrypt.hash(passwordCheck.value, BCRYPT_ROUNDS);
    const cooldownData = createPasswordCooldownData(user.id);

    // Atomically update password, mark email verified, consume token, set 7-day cooldown, and revoke all old sessions
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          emailVerified: user.emailVerified || new Date(),
        },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: record.identifier },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: cooldownData.identifier },
      }),
      prisma.verificationToken.create({
        data: cooldownData,
      }),
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Your password has been reset. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('[reset-password] Error:', error);
    return res.status(500).json({ error: 'Unable to reset password. Please try again.' });
  }
});

/**
 * @api {post} /api/onboarding Complete onboarding
 */
app.post('/api/onboarding', requireAuth, async (req: Request, res: Response) => {
  const { headline, bio, skillsOffered, skillsSought, experienceLevel, availability, timezone } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: SAFE_USER_SELECT,
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const firstName = sanitizeName(req.body?.firstName);
    const lastName = sanitizeName(req.body?.lastName);

    const [, updatedUser] = await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId: user.id },
        update: { headline, bio, skillsOffered: skillsOffered || [], skillsSought: skillsSought || [], experienceLevel, availability, timezone },
        create: { userId: user.id, headline, bio, skillsOffered: skillsOffered || [], skillsSought: skillsSought || [], experienceLevel, availability, timezone }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { isOnboarded: true, ...(firstName && { firstName }), ...(lastName && { lastName }) },
        select: { ...SAFE_USER_SELECT, profile: true },
      })
    ]);

    // Issue updated signed JWT containing isOnboarded: true
    const token = await refreshSessionToken(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        isOnboarded: updatedUser.isOnboarded,
      },
      req.auth?.jti
    );

    res.status(200).json({ success: true, token, user: updatedUser });
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
      select: { ...SAFE_USER_SELECT, password: true, profile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hasPassword = Boolean(user.password);
    const cooldownUntil = await getPasswordCooldownUntil(user.id);
    res.json({
      success: true,
      user: {
        ...sanitizeUser(user),
        hasPassword,
        passwordCooldownUntil: cooldownUntil ? cooldownUntil.toISOString() : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * @api {get} /api/profile Get current user profile (alias)
 */
app.get('/api/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: { ...SAFE_USER_SELECT, password: true, profile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hasPassword = Boolean(user.password);
    const cooldownUntil = await getPasswordCooldownUntil(user.id);
    res.json({
      success: true,
      user: {
        ...sanitizeUser(user),
        hasPassword,
        passwordCooldownUntil: cooldownUntil ? cooldownUntil.toISOString() : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * @api {post} /api/profile Update user profile and settings
 */
app.post('/api/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, headline, bio, skillsOffered, skillsSought, experienceLevel, availability, timezone, matchAlerts, publicProfile, escrowReceipts } = req.body;
    
    await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId: req.auth!.userId },
        update: {
          ...(headline !== undefined && { headline }),
          ...(bio !== undefined && { bio }),
          ...(skillsOffered !== undefined && { skillsOffered }),
          ...(skillsSought !== undefined && { skillsSought }),
          ...(experienceLevel !== undefined && { experienceLevel }),
          ...(availability !== undefined && { availability }),
          ...(timezone !== undefined && { timezone }),
          ...(matchAlerts !== undefined && { matchAlerts: Boolean(matchAlerts) }),
          ...(publicProfile !== undefined && { publicProfile: Boolean(publicProfile) }),
          ...(escrowReceipts !== undefined && { escrowReceipts: Boolean(escrowReceipts) })
        },
        create: {
          userId: req.auth!.userId,
          headline: headline || '',
          bio: bio || '',
          skillsOffered: skillsOffered || [],
          skillsSought: skillsSought || [],
          experienceLevel,
          availability,
          timezone,
          matchAlerts: matchAlerts !== undefined ? Boolean(matchAlerts) : true,
          publicProfile: publicProfile !== undefined ? Boolean(publicProfile) : true,
          escrowReceipts: escrowReceipts !== undefined ? Boolean(escrowReceipts) : true
        }
      }),
      prisma.user.update({
        where: { id: req.auth!.userId },
        data: {
          ...(firstName !== undefined && { firstName: sanitizeName(firstName) }),
          ...(lastName !== undefined && { lastName: sanitizeName(lastName) })
        }
      })
    ]);

    const updatedUser = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: { ...SAFE_USER_SELECT, profile: true }
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * @api {delete} /api/user Delete account
 */
app.delete('/api/user', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.auth!.userId }
    });
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
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
      include: { user: { select: { firstName: true, lastName: true, imageUrl: true, subscriptionTier: true } } },
      skip,
      take: limitNum,
      orderBy: [{ user: { subscriptionTier: 'desc' } }, { createdAt: 'desc' }]
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
      prisma.listing.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              ...PUBLIC_USER_SELECT,
              profile: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: [{ user: { subscriptionTier: 'desc' } }, { createdAt: 'desc' }],
      }),
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

    if (caller.subscriptionTier === 'essential') {
      const activeListingsCount = await prisma.listing.count({
        where: { userId: caller.id, isActive: true }
      });
      if (activeListingsCount >= 1) {
        return res.status(403).json({
          error: 'Essential plan allows only 1 active skill listing. Upgrade to Professional for unlimited listings.'
        });
      }
    }

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

    if (caller.subscriptionTier === 'essential') {
      const requestsSentCount = await prisma.swapRequest.count({
        where: { requesterId: caller.id }
      });
      if (requestsSentCount >= 2) {
        return res.status(403).json({ error: 'Essential plan allows up to 2 swap requests. Upgrade to Professional for unlimited requests.' });
      }
    }

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
/**
 * @api {post} /api/subscriptions/initiate Initialize a subscription payment
 */
app.post('/api/subscriptions/initiate', requireAuth, async (req: Request, res: Response) => {
  try {
    const caller = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!caller) return res.status(404).json({ error: 'User not found' });

    if (caller.subscriptionTier === 'professional') {
      return res.status(400).json({ error: 'You are already on the Professional tier' });
    }

    const txRef = `sub_tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const amount = 49;
    const currency = 'USD';

    // Create a pending transaction
    await prisma.transaction.create({
      data: {
        userId: caller.id,
        txRef,
        amount,
        currency,
        status: 'pending'
      }
    });

    res.status(200).json({
      success: true,
      txRef,
      amount,
      currency,
      user: {
        email: caller.email,
        name: `${caller.firstName} ${caller.lastName}`.trim(),
      }
    });
  } catch (error) {
    console.error('[subscriptions/initiate] Error:', error);
    res.status(500).json({ error: 'Failed to initiate subscription' });
  }
});

/**
 * @api {post} /api/webhooks/flutterwave Flutterwave Webhook
 */
app.post('/api/webhooks/flutterwave', async (req: Request, res: Response) => {
  try {
    // Validate webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers['verif-hash'];
    
    if (secretHash && signature !== secretHash) {
      // In production, enforce this. For local testing, we might want to log it
      console.warn('Webhook signature mismatch or missing');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    console.log('[Webhook] Flutterwave Event:', payload.event);

    if (payload.event === 'charge.completed' && payload.data) {
      const { tx_ref, status, id, amount } = payload.data;

      // Find the transaction
      const transaction = await prisma.transaction.findUnique({
        where: { txRef: tx_ref }
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Check if already processed
      if (transaction.status === 'successful') {
        return res.status(200).json({ success: true, message: 'Already processed' });
      }

      if (status === 'successful') {
        // Run as a transaction: update payment status AND upgrade user
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: 'successful', flutterwaveId: id.toString() }
          }),
          prisma.user.update({
            where: { id: transaction.userId },
            data: { subscriptionTier: 'professional' }
          })
        ]);
        console.log(`[Webhook] User ${transaction.userId} upgraded to Professional.`);
      } else {
        // Mark as failed
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'failed', flutterwaveId: id.toString() }
        });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error processing flutterwave webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Start server
server.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  
  try {
    await prisma.$connect();
    console.log(`[database]: Successfully connected to the database.`);
  } catch (error) {
    console.error(`[database]: Failed to connect to the database! Error:`, error);
  }
});

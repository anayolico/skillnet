import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clerkWebhookHandler = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[warning] Missing CLERK_WEBHOOK_SECRET in non-production. Webhook signature will not be verified.');
    } else {
      console.error('[error] Missing CLERK_WEBHOOK_SECRET. Cannot verify webhook.');
      return res.status(500).json({ error: 'Internal Server Error: Missing Secret' });
    }
  }

  // Get headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // The payload (make sure express.raw() was used)
  const payload = req.body;
  const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;

  let evt: any;

  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    try {
      const wh = new Webhook(WEBHOOK_SECRET);
      evt = wh.verify(payloadString, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err: any) {
      console.error('[error] Error verifying webhook:', err.message);
      return res.status(400).json({ error: 'Error verifying webhook signature' });
    }
  } else {
    // Development fallback if secret isn't provided
    try {
      evt = typeof payloadString === 'string' ? JSON.parse(payloadString) : payloadString;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
      case 'user.updated': {
        const emails = evt.data.email_addresses;
        const primaryEmail = emails?.find((e: any) => e.id === evt.data.primary_email_address_id)?.email_address || emails?.[0]?.email_address;
        
        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: primaryEmail,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            imageUrl: evt.data.image_url,
          },
          create: {
            clerkId: id,
            email: primaryEmail,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            imageUrl: evt.data.image_url,
          }
        });
        console.log(`[database]: User ${id} was ${eventType === 'user.created' ? 'created' : 'updated'}`);
        break;
      }
      
      case 'user.deleted': {
        await prisma.user.delete({
          where: { clerkId: id }
        });
        console.log(`[database]: User ${id} was deleted`);
        break;
      }
      
      default:
        console.log(`[webhook]: Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error('[database]: Error syncing user', error);
    return res.status(500).json({ error: 'Database sync failed' });
  }

  return res.status(200).json({ success: true });
};

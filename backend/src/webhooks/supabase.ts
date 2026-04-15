import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const supabaseWebhookHandler = async (req: Request, res: Response) => {
  // Normally, you would verify a shared secret here to ensure the webhook comes from Supabase.
  const { type, record } = req.body;

  if (type === 'INSERT' && record) {
    try {
      await prisma.user.upsert({
        where: { supabaseId: record.id },
        update: {
          email: record.email,
        },
        create: {
          supabaseId: record.id,
          email: record.email,
          firstName: record.raw_user_meta_data?.first_name || '',
          lastName: record.raw_user_meta_data?.last_name || '',
        }
      });
      console.log(`[database]: User ${record.id} was created via Supabase Webhook`);
    } catch (error) {
      console.error('[database]: Error syncing user', error);
      return res.status(500).json({ error: 'Database sync failed' });
    }
  } else if (type === 'DELETE' && record) {
    try {
      await prisma.user.delete({
        where: { supabaseId: record.id }
      });
      console.log(`[database]: User ${record.id} was deleted via Supabase Webhook`);
    } catch (error) {
      console.error('[database]: Error deleting user', error);
    }
  }

  return res.status(200).json({ success: true });
};

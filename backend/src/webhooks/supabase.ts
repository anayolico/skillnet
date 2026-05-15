import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const supabaseWebhookHandler = async (req: Request, res: Response) => {
  // Normally, you would verify a shared secret here to ensure the webhook comes from Supabase.
  const { type, record } = req.body;
  
  console.log(`[webhook/supabase]: Received ${type} event for user ${record?.id}`);

  if (type === 'INSERT' && record) {
    try {
      const user = await prisma.user.upsert({
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
      console.log(`[webhook/supabase]: ✅ User ${record.id} successfully synced via webhook (ID: ${user.id})`);
    } catch (error) {
      console.error('[webhook/supabase]: ❌ Error syncing user via webhook', error);
      return res.status(500).json({ error: 'Database sync failed' });
    }
  } else if (type === 'DELETE' && record) {
    try {
      await prisma.user.delete({
        where: { supabaseId: record.id }
      });
      console.log(`[webhook/supabase]: 🗑️ User ${record.id} deleted via webhook`);
    } catch (error) {
      console.error('[webhook/supabase]: ❌ Error deleting user via webhook', error);
    }
  }

  return res.status(200).json({ success: true });
};

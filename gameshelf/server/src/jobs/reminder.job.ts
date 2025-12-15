import cron from 'node-cron';
import { prisma } from '../lib/prisma.js';
import { sendOverdueReminder } from '../services/email.service.js';

async function sendOverdueReminders() {
  console.log('[Reminder Job] Starting overdue check...');
  
  try {
    // Find all overdue borrows that haven't been returned
    const overdueBorrows = await prisma.borrow.findMany({
      where: {
        returnedAt: null,
        dueAt: {
          lt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        game: {
          select: {
            title: true,
            library: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    console.log(`[Reminder Job] Found ${overdueBorrows.length} overdue borrow(s)`);

    for (const borrow of overdueBorrows) {
      if (borrow.dueAt) {
        await sendOverdueReminder(
          borrow.user.email,
          borrow.user.name,
          borrow.game.title,
          borrow.dueAt,
          borrow.game.library.name
        );
        console.log(`[Reminder Job] Sent reminder to ${borrow.user.email} for "${borrow.game.title}"`);
      }
    }

    console.log('[Reminder Job] Completed');
  } catch (error) {
    console.error('[Reminder Job] Error:', error);
  }
}

export function startReminderJob() {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', sendOverdueReminders, {
    timezone: 'America/New_York',
  });
  
  console.log('[Reminder Job] Scheduled to run daily at 9:00 AM');
}

// Export for manual triggering (useful for testing)
export { sendOverdueReminders };


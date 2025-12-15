import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';
import { startReminderJob } from './jobs/reminder.job.js';

const port = env.PORT;

app.listen(port, () => {
  console.log(`🎲 GameShelf server running on port ${port}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  
  // Start cron jobs
  startReminderJob();
  console.log('   📅 Reminder job scheduled');
});

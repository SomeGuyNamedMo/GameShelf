import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.warn('Email not configured, skipping send:', options.subject);
    return false;
  }

  try {
    await transport.sendMail({
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendOverdueReminder(
  userEmail: string,
  userName: string,
  gameTitle: string,
  dueDate: Date,
  libraryName: string
): Promise<boolean> {
  const daysOverdue = Math.floor(
    (Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return sendEmail({
    to: userEmail,
    subject: `Reminder: "${gameTitle}" is overdue`,
    text: `Hi ${userName},

This is a friendly reminder that "${gameTitle}" from ${libraryName} was due ${daysOverdue} day(s) ago.

Please return it when you get a chance so others can enjoy it too!

Thanks,
GameShelf`,
    html: `
      <h2>Hi ${userName},</h2>
      <p>This is a friendly reminder that <strong>"${gameTitle}"</strong> from <strong>${libraryName}</strong> was due <strong>${daysOverdue} day(s) ago</strong>.</p>
      <p>Please return it when you get a chance so others can enjoy it too!</p>
      <br>
      <p>Thanks,<br>GameShelf</p>
    `,
  });
}


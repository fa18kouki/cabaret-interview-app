import nodemailer from "nodemailer";
import type { NotificationEvent } from "../types";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!process.env.EMAIL_SERVER_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmailNotification(
  event: NotificationEvent
): Promise<void> {
  if (event.type !== "OFFER_RECEIVED") return;

  const { castEmail, storeName, storeArea, offerMessage } = event.payload;

  if (!castEmail) return;

  const mailer = getTransporter();
  if (!mailer) {
    console.warn("[Email] EMAIL_SERVER_HOST not configured, skipping");
    return;
  }

  const appUrl = process.env.AUTH_URL ?? "https://lumina.app";

  await mailer.sendMail({
    from: process.env.EMAIL_FROM ?? "noreply@lumina.app",
    to: castEmail,
    subject: `【LUMINA】${storeName}からオファーが届きました`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">LUMINA</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <h2 style="color: #1a1a2e; margin-top: 0;">新しいオファーが届きました</h2>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 4px; font-weight: bold; font-size: 18px;">${storeName}</p>
            <p style="margin: 0; color: #666; font-size: 14px;">${storeArea}</p>
          </div>
          <p style="color: #333; line-height: 1.6;">${offerMessage.slice(0, 200)}</p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${appUrl}/offers"
               style="display: inline-block; background: #1a1a2e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              オファーを確認する
            </a>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>このメールはLUMINAから自動送信されています。</p>
        </div>
      </div>
    `,
  });
}

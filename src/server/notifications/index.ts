import { createInAppNotification } from "./channels/in-app";
import { sendLineNotification } from "./channels/line";
import { sendEmailNotification } from "./channels/email";
import type { NotificationEvent } from "./types";

/**
 * 全チャネルに通知を送信する
 * 各チャネルは独立して失敗可能（fail-open）
 */
export async function dispatchNotification(
  event: NotificationEvent
): Promise<void> {
  const results = await Promise.allSettled([
    createInAppNotification(event),
    sendLineNotification(event),
    sendEmailNotification(event),
  ]);

  const channels = ["in-app", "LINE", "email"];
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[Notification] ${channels[index]} failed for ${event.type}:`,
        result.reason
      );
    }
  });
}

import { prisma } from "@/server/db";
import type { NotificationEvent } from "../types";

export async function createInAppNotification(
  event: NotificationEvent
): Promise<void> {
  if (event.type !== "OFFER_RECEIVED") return;

  const { castUserId, storeName, offerId } = event.payload;

  await prisma.notification.create({
    data: {
      userId: castUserId,
      type: "OFFER_RECEIVED",
      title: "新しいオファー",
      body: `${storeName}からオファーが届きました`,
      link: "/offers",
      metadata: {
        offerId,
        storeName,
      },
    },
  });
}

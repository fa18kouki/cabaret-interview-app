import { messagingApi } from "@line/bot-sdk";
import type { NotificationEvent } from "../types";

let client: messagingApi.MessagingApiClient | null = null;

function getLineClient(): messagingApi.MessagingApiClient | null {
  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) return null;
  if (!client) {
    client = new messagingApi.MessagingApiClient({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    });
  }
  return client;
}

export async function sendLineNotification(
  event: NotificationEvent
): Promise<void> {
  if (event.type !== "OFFER_RECEIVED") return;

  const { castLineUserId, storeName, storeArea, offerMessage } = event.payload;

  if (!castLineUserId) return;

  const lineClient = getLineClient();
  if (!lineClient) {
    console.warn("[LINE] LINE_CHANNEL_ACCESS_TOKEN not configured, skipping");
    return;
  }

  const appUrl = process.env.AUTH_URL ?? "https://lumina.app";

  await lineClient.pushMessage({
    to: castLineUserId,
    messages: [
      {
        type: "flex",
        altText: `${storeName}からオファーが届きました`,
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "新しいオファー",
                weight: "bold",
                size: "lg",
                color: "#1a1a2e",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: storeName,
                weight: "bold",
                size: "xl",
              },
              {
                type: "text",
                text: storeArea,
                size: "sm",
                color: "#999999",
              },
              {
                type: "text",
                text: offerMessage.slice(0, 100),
                wrap: true,
                size: "sm",
                margin: "md",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "オファーを確認する",
                  uri: `${appUrl}/offers`,
                },
                style: "primary",
                color: "#1a1a2e",
              },
            ],
          },
        },
      },
    ],
  });
}

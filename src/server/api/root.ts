import { createTRPCRouter, createCallerFactory } from "./trpc";
import { castRouter } from "./routers/cast";
import { storeRouter } from "./routers/store";
import { matchRouter } from "./routers/match";
import { interviewRouter } from "./routers/interview";
import { messageRouter } from "./routers/message";
import { adminRouter } from "./routers/admin";
import { diagnosisRouter } from "./routers/diagnosis";
import { notificationRouter } from "./routers/notification";

/**
 * メインルーター
 */
export const appRouter = createTRPCRouter({
  cast: castRouter,
  store: storeRouter,
  match: matchRouter,
  interview: interviewRouter,
  message: messageRouter,
  admin: adminRouter,
  diagnosis: diagnosisRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;

/**
 * サーバーサイドでtRPCを呼び出すためのファクトリ
 */
export const createCaller = createCallerFactory(appRouter);

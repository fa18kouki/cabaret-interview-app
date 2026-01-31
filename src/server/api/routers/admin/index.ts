import { createTRPCRouter } from "@/server/api/trpc";
import { adminDashboardRouter } from "./dashboard";
import { adminUsersRouter } from "./users";
import { adminCastsRouter } from "./casts";
import { adminStoresRouter } from "./stores";
import { adminPenaltiesRouter } from "./penalties";
import { adminOversightRouter } from "./oversight";

/**
 * 管理者用ルーター
 */
export const adminRouter = createTRPCRouter({
  dashboard: adminDashboardRouter,
  users: adminUsersRouter,
  casts: adminCastsRouter,
  stores: adminStoresRouter,
  penalties: adminPenaltiesRouter,
  oversight: adminOversightRouter,
});

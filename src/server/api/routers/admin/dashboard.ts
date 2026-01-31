import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

/**
 * 管理者ダッシュボードルーター
 */
export const adminDashboardRouter = createTRPCRouter({
  /**
   * 全体統計取得
   */
  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    // カウント取得を並列実行
    const [
      totalUsers,
      totalCasts,
      totalStores,
      totalMatches,
      totalInterviews,
      totalOffers,
      pendingCasts,
      pendingStores,
      suspendedCasts,
      scheduledInterviews,
      noShowInterviews,
      newUsersToday,
      newUsersThisWeek,
      newMatchesToday,
      newInterviewsToday,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.cast.count(),
      ctx.prisma.store.count(),
      ctx.prisma.match.count(),
      ctx.prisma.interview.count(),
      ctx.prisma.offer.count(),
      ctx.prisma.cast.count({ where: { idVerified: false } }),
      ctx.prisma.store.count({ where: { isVerified: false } }),
      ctx.prisma.cast.count({ where: { isSuspended: true } }),
      ctx.prisma.interview.count({ where: { status: "SCHEDULED" } }),
      ctx.prisma.interview.count({ where: { status: "NO_SHOW" } }),
      ctx.prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      ctx.prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      ctx.prisma.match.count({ where: { createdAt: { gte: startOfToday } } }),
      ctx.prisma.interview.count({
        where: { createdAt: { gte: startOfToday } },
      }),
    ]);

    return {
      counts: {
        totalUsers,
        totalCasts,
        totalStores,
        totalMatches,
        totalInterviews,
        totalOffers,
        pendingVerifications: {
          casts: pendingCasts,
          stores: pendingStores,
        },
        suspendedCasts,
        scheduledInterviews,
        noShowInterviews,
      },
      recentActivity: {
        newUsersToday,
        newUsersThisWeek,
        newMatchesToday,
        newInterviewsToday,
      },
    };
  }),

  /**
   * 最近のアクティビティ取得
   */
  getRecentActivity: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const [recentUsers, recentMatches, recentInterviews] = await Promise.all([
        ctx.prisma.user.findMany({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
        }),
        ctx.prisma.match.findMany({
          select: {
            id: true,
            status: true,
            createdAt: true,
            cast: {
              select: { nickname: true },
            },
            store: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
        }),
        ctx.prisma.interview.findMany({
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            cast: {
              select: { nickname: true },
            },
            store: {
              select: { name: true },
            },
          },
          orderBy: { scheduledAt: "desc" },
          take: input.limit,
        }),
      ]);

      return {
        recentUsers,
        recentMatches,
        recentInterviews,
      };
    }),
});

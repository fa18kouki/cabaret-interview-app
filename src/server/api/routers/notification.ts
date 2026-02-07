import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  /**
   * 未読通知数を取得
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.notification.count({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
    });

    return { count };
  }),

  /**
   * 通知一覧を取得
   */
  getAll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.prisma.notification.findMany({
        where: { userId: ctx.session.user.id },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (notifications.length > input.limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.id;
      }

      return { notifications, nextCursor };
    }),

  /**
   * 通知を既読にする
   */
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { isRead: true, readAt: new Date() },
      });
    }),

  /**
   * 全通知を既読にする
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: { userId: ctx.session.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }),
});

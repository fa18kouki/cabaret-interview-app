import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  /**
   * メッセージ送信
   */
  send: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          cast: { select: { id: true } },
          store: { select: { id: true } },
        },
      });

      const castId = user?.cast?.id;
      const storeId = user?.store?.id;

      // マッチングが自分に関連しているか確認
      const match = await ctx.prisma.match.findFirst({
        where: {
          id: input.matchId,
          status: "ACCEPTED",
          OR: [
            { castId: castId ?? "" },
            { storeId: storeId ?? "" },
          ],
        },
      });

      if (!match) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "マッチングが見つからないか、メッセージを送信できません",
        });
      }

      const message = await ctx.prisma.message.create({
        data: {
          matchId: input.matchId,
          senderId: ctx.session.user.id,
          content: input.content,
        },
      });

      return message;
    }),

  /**
   * メッセージ一覧取得
   */
  getMessages: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          cast: { select: { id: true } },
          store: { select: { id: true } },
        },
      });

      const castId = user?.cast?.id;
      const storeId = user?.store?.id;

      // マッチングが自分に関連しているか確認
      const match = await ctx.prisma.match.findFirst({
        where: {
          id: input.matchId,
          OR: [
            { castId: castId ?? "" },
            { storeId: storeId ?? "" },
          ],
        },
      });

      if (!match) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "マッチングが見つかりません",
        });
      }

      const messages = await ctx.prisma.message.findMany({
        where: { matchId: input.matchId },
        include: {
          sender: {
            select: {
              id: true,
              image: true,
            },
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      // 未読メッセージを既読に
      await ctx.prisma.message.updateMany({
        where: {
          matchId: input.matchId,
          senderId: { not: ctx.session.user.id },
          isRead: false,
        },
        data: { isRead: true },
      });

      let nextCursor: string | undefined;
      if (messages.length > input.limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages: messages.reverse(), // 時系列順に
        nextCursor,
      };
    }),

  /**
   * 未読メッセージ数取得
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        cast: { select: { id: true } },
        store: { select: { id: true } },
      },
    });

    const castId = user?.cast?.id;
    const storeId = user?.store?.id;

    if (!castId && !storeId) {
      return { count: 0 };
    }

    // 自分が関連するマッチングを取得
    const matches = await ctx.prisma.match.findMany({
      where: {
        OR: [
          { castId: castId ?? "" },
          { storeId: storeId ?? "" },
        ],
        status: "ACCEPTED",
      },
      select: { id: true },
    });

    const matchIds = matches.map((m) => m.id);

    const count = await ctx.prisma.message.count({
      where: {
        matchId: { in: matchIds },
        senderId: { not: ctx.session.user.id },
        isRead: false,
      },
    });

    return { count };
  }),
});

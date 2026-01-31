import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const interviewRouter = createTRPCRouter({
  /**
   * 面接予約
   */
  schedule: protectedProcedure
    .input(
      z.object({
        offerId: z.string(),
        scheduledAt: z.string().datetime(),
        notes: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const offer = await ctx.prisma.offer.findUnique({
        where: { id: input.offerId },
        include: {
          cast: { select: { id: true, userId: true } },
          store: { select: { id: true, userId: true } },
        },
      });

      if (!offer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "オファーが見つかりません",
        });
      }

      // オファーが承諾済みか確認
      if (offer.status !== "ACCEPTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "オファーが承諾されていません",
        });
      }

      // 権限確認（オファーに関連するユーザーのみ）
      const isRelated =
        offer.cast.userId === ctx.session.user.id ||
        offer.store.userId === ctx.session.user.id;

      if (!isRelated) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "このオファーに対する権限がありません",
        });
      }

      const interview = await ctx.prisma.interview.create({
        data: {
          offerId: input.offerId,
          castId: offer.cast.id,
          storeId: offer.store.id,
          scheduledAt: new Date(input.scheduledAt),
          notes: input.notes,
        },
      });

      return interview;
    }),

  /**
   * 面接一覧取得
   */
  getInterviews: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["SCHEDULED", "COMPLETED", "NO_SHOW", "CANCELLED"])
          .optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
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

      if (!castId && !storeId) {
        return { interviews: [], nextCursor: undefined };
      }

      const interviews = await ctx.prisma.interview.findMany({
        where: {
          OR: [
            { castId: castId ?? "" },
            { storeId: storeId ?? "" },
          ],
          ...(input.status && { status: input.status }),
        },
        include: {
          cast: {
            select: {
              id: true,
              nickname: true,
              photos: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              area: true,
            },
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { scheduledAt: "asc" },
      });

      let nextCursor: string | undefined;
      if (interviews.length > input.limit) {
        const nextItem = interviews.pop();
        nextCursor = nextItem?.id;
      }

      return {
        interviews,
        nextCursor,
      };
    }),

  /**
   * 面接キャンセル
   */
  cancel: protectedProcedure
    .input(
      z.object({
        interviewId: z.string(),
        reason: z.string().max(500).optional(),
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

      const interview = await ctx.prisma.interview.findFirst({
        where: {
          id: input.interviewId,
          OR: [
            { castId: castId ?? "" },
            { storeId: storeId ?? "" },
          ],
          status: "SCHEDULED",
        },
      });

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "面接が見つからないか、キャンセルできません",
        });
      }

      return ctx.prisma.interview.update({
        where: { id: input.interviewId },
        data: {
          status: "CANCELLED",
          notes: input.reason
            ? `${interview.notes ?? ""}\n[キャンセル理由] ${input.reason}`
            : interview.notes,
        },
      });
    }),

  /**
   * 無断欠席報告
   */
  reportNoShow: protectedProcedure
    .input(
      z.object({
        interviewId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { store: { select: { id: true } } },
      });

      const storeId = user?.store?.id;

      if (!storeId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "店舗のみ無断欠席を報告できます",
        });
      }

      const interview = await ctx.prisma.interview.findFirst({
        where: {
          id: input.interviewId,
          storeId,
          status: "SCHEDULED",
        },
        include: {
          cast: { select: { id: true, userId: true, penaltyCount: true } },
        },
      });

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "面接が見つかりません",
        });
      }

      // トランザクションで更新
      await ctx.prisma.$transaction([
        // 面接ステータスを更新
        ctx.prisma.interview.update({
          where: { id: input.interviewId },
          data: { status: "NO_SHOW" },
        }),
        // キャストのペナルティカウントを増加
        ctx.prisma.cast.update({
          where: { id: interview.cast.id },
          data: {
            penaltyCount: { increment: 1 },
            // 3回以上で利用停止
            isSuspended: interview.cast.penaltyCount >= 2,
          },
        }),
        // ペナルティ記録を作成
        ctx.prisma.penalty.create({
          data: {
            userId: interview.cast.userId,
            type: "NO_SHOW",
            interviewId: interview.id,
            reason: "面接の無断欠席",
          },
        }),
      ]);

      return { success: true };
    }),
});

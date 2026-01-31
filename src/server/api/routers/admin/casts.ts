import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { paginationInput, castRankEnum } from "./schemas";

/**
 * キャスト管理ルーター
 */
export const adminCastsRouter = createTRPCRouter({
  /**
   * キャスト一覧取得
   */
  list: adminProcedure
    .input(
      paginationInput.extend({
        idVerified: z.boolean().optional(),
        isSuspended: z.boolean().optional(),
        rank: castRankEnum.optional(),
        area: z.string().optional(),
        minPenaltyCount: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const casts = await ctx.prisma.cast.findMany({
        where: {
          ...(input.idVerified !== undefined && {
            idVerified: input.idVerified,
          }),
          ...(input.isSuspended !== undefined && {
            isSuspended: input.isSuspended,
          }),
          ...(input.rank && { rank: input.rank }),
          ...(input.area && {
            desiredAreas: { has: input.area },
          }),
          ...(input.minPenaltyCount !== undefined && {
            penaltyCount: { gte: input.minPenaltyCount },
          }),
        },
        include: {
          user: {
            select: { id: true, email: true, phone: true },
          },
          _count: {
            select: { matches: true, interviews: true },
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (casts.length > input.limit) {
        const nextItem = casts.pop();
        nextCursor = nextItem?.id;
      }

      return { casts, nextCursor };
    }),

  /**
   * キャスト詳細取得
   */
  getById: adminProcedure
    .input(z.object({ castId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { id: input.castId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              createdAt: true,
            },
          },
          _count: {
            select: { matches: true, offers: true, interviews: true },
          },
        },
      });

      if (!cast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "キャストが見つかりません",
        });
      }

      return cast;
    }),

  /**
   * 本人確認（年齢確認）
   */
  verifyId: adminProcedure
    .input(
      z.object({
        castId: z.string(),
        verified: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { id: input.castId },
      });

      if (!cast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "キャストが見つかりません",
        });
      }

      const updated = await ctx.prisma.cast.update({
        where: { id: input.castId },
        data: { idVerified: input.verified },
      });

      return { id: updated.id, idVerified: updated.idVerified };
    }),

  /**
   * ランク更新
   */
  updateRank: adminProcedure
    .input(
      z.object({
        castId: z.string(),
        rank: castRankEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { id: input.castId },
      });

      if (!cast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "キャストが見つかりません",
        });
      }

      const updated = await ctx.prisma.cast.update({
        where: { id: input.castId },
        data: { rank: input.rank },
      });

      return { id: updated.id, rank: updated.rank };
    }),

  /**
   * キャスト停止
   */
  suspend: adminProcedure
    .input(
      z.object({
        castId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { id: input.castId },
      });

      if (!cast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "キャストが見つかりません",
        });
      }

      await ctx.prisma.cast.update({
        where: { id: input.castId },
        data: { isSuspended: true },
      });

      // 停止理由があればペナルティを記録
      if (input.reason) {
        await ctx.prisma.penalty.create({
          data: {
            userId: cast.userId,
            type: "OTHER",
            reason: input.reason,
          },
        });
      }

      return { success: true };
    }),

  /**
   * キャスト停止解除
   */
  unsuspend: adminProcedure
    .input(
      z.object({
        castId: z.string(),
        resetPenaltyCount: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { id: input.castId },
      });

      if (!cast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "キャストが見つかりません",
        });
      }

      await ctx.prisma.cast.update({
        where: { id: input.castId },
        data: {
          isSuspended: false,
          ...(input.resetPenaltyCount && { penaltyCount: 0 }),
        },
      });

      return { success: true };
    }),
});

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { paginationInput, penaltyTypeEnum } from "./schemas";

/**
 * ペナルティ管理ルーター
 */
export const adminPenaltiesRouter = createTRPCRouter({
  /**
   * ペナルティ一覧取得
   */
  list: adminProcedure
    .input(
      paginationInput.extend({
        type: penaltyTypeEnum.optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const penalties = await ctx.prisma.penalty.findMany({
        where: {
          ...(input.type && { type: input.type }),
          ...(input.userId && { userId: input.userId }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (penalties.length > input.limit) {
        const nextItem = penalties.pop();
        nextCursor = nextItem?.id;
      }

      return { penalties, nextCursor };
    }),

  /**
   * 手動ペナルティ追加
   */
  add: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        type: penaltyTypeEnum,
        reason: z.string().optional(),
        interviewId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { cast: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ユーザーが見つかりません",
        });
      }

      const penalty = await ctx.prisma.penalty.create({
        data: {
          userId: input.userId,
          type: input.type,
          reason: input.reason,
          interviewId: input.interviewId,
        },
      });

      // キャストの場合はpenaltyCountを増加
      let updatedCast = null;
      if (user.cast) {
        updatedCast = await ctx.prisma.cast.update({
          where: { id: user.cast.id },
          data: {
            penaltyCount: { increment: 1 },
            // 3回以上で利用停止
            isSuspended: user.cast.penaltyCount >= 2,
          },
        });
      }

      return {
        penalty,
        cast: updatedCast
          ? {
              id: updatedCast.id,
              penaltyCount: updatedCast.penaltyCount,
              isSuspended: updatedCast.isSuspended,
            }
          : undefined,
      };
    }),

  /**
   * ユーザーのペナルティ履歴取得
   */
  getByUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const penalties = await ctx.prisma.penalty.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });

      return {
        penalties,
        totalCount: penalties.length,
      };
    }),
});

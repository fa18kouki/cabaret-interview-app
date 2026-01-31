import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  castProcedure,
} from "@/server/api/trpc";

export const castRouter = createTRPCRouter({
  /**
   * キャストプロフィール取得
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const cast = await ctx.prisma.cast.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return cast;
  }),

  /**
   * キャストプロフィール作成・更新
   */
  upsertProfile: protectedProcedure
    .input(
      z.object({
        nickname: z.string().min(1).max(50),
        age: z.number().min(18).max(99),
        description: z.string().max(1000).optional(),
        photos: z.array(z.string().url()).max(10).optional(),
        desiredAreas: z.array(z.string()).optional(),
        desiredSalary: z.number().positive().optional(),
        mustConditions: z.record(z.string(), z.unknown()).optional(),
        wantConditions: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const mustConditions = input.mustConditions as Prisma.InputJsonValue | undefined;
      const wantConditions = input.wantConditions as Prisma.InputJsonValue | undefined;

      const cast = await ctx.prisma.cast.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          nickname: input.nickname,
          age: input.age,
          description: input.description,
          photos: input.photos ?? [],
          desiredAreas: input.desiredAreas ?? [],
          desiredSalary: input.desiredSalary,
          mustConditions,
          wantConditions,
        },
        create: {
          userId: ctx.session.user.id,
          nickname: input.nickname,
          age: input.age,
          description: input.description,
          photos: input.photos ?? [],
          desiredAreas: input.desiredAreas ?? [],
          desiredSalary: input.desiredSalary,
          mustConditions,
          wantConditions,
        },
      });

      // ユーザーロールをCASTに設定
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { role: "CAST" },
      });

      return cast;
    }),

  /**
   * 店舗検索
   */
  searchStores: castProcedure
    .input(
      z.object({
        area: z.string().optional(),
        minSalary: z.number().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const stores = await ctx.prisma.store.findMany({
        where: {
          isVerified: true,
          ...(input.area && { area: { contains: input.area } }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (stores.length > input.limit) {
        const nextItem = stores.pop();
        nextCursor = nextItem?.id;
      }

      return {
        stores,
        nextCursor,
      };
    }),

  /**
   * 受信オファー一覧
   */
  getOffers: castProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!cast) {
        return { offers: [], nextCursor: undefined };
      }

      const offers = await ctx.prisma.offer.findMany({
        where: {
          castId: cast.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              area: true,
              photos: true,
            },
          },
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (offers.length > input.limit) {
        const nextItem = offers.pop();
        nextCursor = nextItem?.id;
      }

      return {
        offers,
        nextCursor,
      };
    }),

  /**
   * オファーに回答
   */
  respondToOffer: castProcedure
    .input(
      z.object({
        offerId: z.string(),
        accept: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cast = await ctx.prisma.cast.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!cast) {
        throw new Error("キャストプロフィールが見つかりません");
      }

      const offer = await ctx.prisma.offer.update({
        where: {
          id: input.offerId,
          castId: cast.id,
        },
        data: {
          status: input.accept ? "ACCEPTED" : "REJECTED",
        },
      });

      // オファー承諾時にマッチングを作成
      if (input.accept) {
        await ctx.prisma.match.create({
          data: {
            castId: cast.id,
            storeId: offer.storeId,
            status: "ACCEPTED",
          },
        });
      }

      return offer;
    }),
});

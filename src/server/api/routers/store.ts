import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  storeProcedure,
} from "@/server/api/trpc";

export const storeRouter = createTRPCRouter({
  /**
   * 店舗プロフィール取得
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const store = await ctx.prisma.store.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return store;
  }),

  /**
   * 店舗プロフィール作成・更新
   */
  upsertProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        area: z.string().min(1).max(50),
        address: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        photos: z.array(z.string().url()).max(20).optional(),
        businessHours: z.string().max(200).optional(),
        salarySystem: z.string().max(500).optional(),
        benefits: z.array(z.string()).optional(),
        mustConditions: z.record(z.string(), z.unknown()).optional(),
        wantConditions: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const mustConditions = input.mustConditions as Prisma.InputJsonValue | undefined;
      const wantConditions = input.wantConditions as Prisma.InputJsonValue | undefined;

      const store = await ctx.prisma.store.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          name: input.name,
          area: input.area,
          address: input.address,
          description: input.description,
          photos: input.photos ?? [],
          businessHours: input.businessHours,
          salarySystem: input.salarySystem,
          benefits: input.benefits ?? [],
          mustConditions,
          wantConditions,
        },
        create: {
          userId: ctx.session.user.id,
          name: input.name,
          area: input.area,
          address: input.address,
          description: input.description,
          photos: input.photos ?? [],
          businessHours: input.businessHours,
          salarySystem: input.salarySystem,
          benefits: input.benefits ?? [],
          mustConditions,
          wantConditions,
        },
      });

      // ユーザーロールをSTOREに設定
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { role: "STORE" },
      });

      return store;
    }),

  /**
   * キャスト検索
   */
  searchCasts: storeProcedure
    .input(
      z.object({
        area: z.string().optional(),
        minAge: z.number().min(18).optional(),
        maxAge: z.number().max(99).optional(),
        rank: z.enum(["UNRANKED", "BRONZE", "SILVER", "GOLD", "PLATINUM"]).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const casts = await ctx.prisma.cast.findMany({
        where: {
          idVerified: true,
          isSuspended: false,
          ...(input.area && {
            desiredAreas: { has: input.area },
          }),
          ...(input.minAge && { age: { gte: input.minAge } }),
          ...(input.maxAge && { age: { lte: input.maxAge } }),
          ...(input.rank && { rank: input.rank }),
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

      return {
        casts,
        nextCursor,
      };
    }),

  /**
   * オファー送信
   */
  sendOffer: storeProcedure
    .input(
      z.object({
        castId: z.string(),
        message: z.string().min(1).max(1000),
        expiresInDays: z.number().min(1).max(30).default(7),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!store) {
        throw new Error("店舗プロフィールが見つかりません");
      }

      // 既存のオファーがないか確認
      const existingOffer = await ctx.prisma.offer.findFirst({
        where: {
          storeId: store.id,
          castId: input.castId,
          status: "PENDING",
        },
      });

      if (existingOffer) {
        throw new Error("このキャストには既にオファーを送信済みです");
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);

      const offer = await ctx.prisma.offer.create({
        data: {
          storeId: store.id,
          castId: input.castId,
          message: input.message,
          expiresAt,
        },
      });

      return offer;
    }),

  /**
   * 送信オファー一覧
   */
  getSentOffers: storeProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!store) {
        return { offers: [], nextCursor: undefined };
      }

      const offers = await ctx.prisma.offer.findMany({
        where: {
          storeId: store.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          cast: {
            select: {
              id: true,
              nickname: true,
              age: true,
              photos: true,
              rank: true,
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
});

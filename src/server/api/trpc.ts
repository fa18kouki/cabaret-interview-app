import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Session } from "next-auth";
import { prisma } from "@/server/db";
import { auth } from "@/lib/auth";

/**
 * コンテキスト型の定義
 */
export interface CreateContextOptions {
  session: Session | null;
}

/**
 * 内部コンテキスト作成（テスト用）
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * APIリクエスト用コンテキスト作成
 */
export const createTRPCContext = async () => {
  const session = await auth();

  return createInnerTRPCContext({
    session,
  });
};

/**
 * tRPC初期化
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * ルーター作成
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * パブリックプロシージャ（認証不要）
 */
export const publicProcedure = t.procedure;

/**
 * 認証済みプロシージャ
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * キャスト専用プロシージャ
 */
export const castProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (user?.role !== "CAST") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "キャストのみアクセス可能です",
    });
  }

  return next({ ctx });
});

/**
 * 店舗専用プロシージャ
 */
export const storeProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (user?.role !== "STORE") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "店舗のみアクセス可能です",
    });
  }

  return next({ ctx });
});

/**
 * 管理者専用プロシージャ
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "管理者のみアクセス可能です",
    });
  }

  return next({ ctx });
});

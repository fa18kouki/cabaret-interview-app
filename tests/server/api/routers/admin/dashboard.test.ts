import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import {
  createAdminCaller,
  createNonAdminCaller,
  createUnauthenticatedCaller,
  createTestAdminUser,
  createTestCastUser,
  createTestStoreUser,
  cleanupTestData,
  prisma,
} from "./__helpers__/setup";

describe("admin.dashboard", () => {
  let adminUserId: string;
  let nonAdminUserId: string;

  beforeAll(async () => {
    await cleanupTestData();

    // 管理者ユーザーを作成
    const adminUser = await createTestAdminUser({
      id: "admin-dashboard-test",
      email: "admin-dashboard@test.com",
    });
    adminUserId = adminUser.id;

    // 非管理者ユーザーを作成
    const castUser = await createTestCastUser(
      { id: "cast-dashboard-test", email: "cast-dashboard@test.com" },
      { nickname: "テストキャスト" }
    );
    nonAdminUserId = castUser.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("getStats", () => {
    beforeEach(async () => {
      // 追加のテストデータをクリーンアップ（基本ユーザーは残す）
      await prisma.penalty.deleteMany({});
      await prisma.message.deleteMany({});
      await prisma.interview.deleteMany({});
      await prisma.offer.deleteMany({});
      await prisma.match.deleteMany({});
    });

    it("管理者は統計情報を取得できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.dashboard.getStats();

      expect(result).toBeDefined();
      expect(result.counts).toBeDefined();
      expect(typeof result.counts.totalUsers).toBe("number");
      expect(typeof result.counts.totalCasts).toBe("number");
      expect(typeof result.counts.totalStores).toBe("number");
      expect(typeof result.counts.totalMatches).toBe("number");
      expect(typeof result.counts.totalInterviews).toBe("number");
      expect(typeof result.counts.totalOffers).toBe("number");
      expect(result.counts.pendingVerifications).toBeDefined();
      expect(typeof result.counts.pendingVerifications.casts).toBe("number");
      expect(typeof result.counts.pendingVerifications.stores).toBe("number");
      expect(typeof result.counts.suspendedCasts).toBe("number");
      expect(typeof result.counts.scheduledInterviews).toBe("number");
      expect(typeof result.counts.noShowInterviews).toBe("number");

      expect(result.recentActivity).toBeDefined();
      expect(typeof result.recentActivity.newUsersToday).toBe("number");
      expect(typeof result.recentActivity.newUsersThisWeek).toBe("number");
      expect(typeof result.recentActivity.newMatchesToday).toBe("number");
      expect(typeof result.recentActivity.newInterviewsToday).toBe("number");
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(caller.admin.dashboard.getStats()).rejects.toThrow(
        TRPCError
      );
      await expect(caller.admin.dashboard.getStats()).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });

    it("未認証ユーザーはアクセスできない", async () => {
      const caller = createUnauthenticatedCaller();

      await expect(caller.admin.dashboard.getStats()).rejects.toThrow(
        TRPCError
      );
      await expect(caller.admin.dashboard.getStats()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("カウントが正確に計算される", async () => {
      // テストデータを追加
      await createTestCastUser(
        { email: "cast-count-1@test.com" },
        { nickname: "カウント用キャスト1", idVerified: false }
      );
      await createTestCastUser(
        { email: "cast-count-2@test.com" },
        { nickname: "カウント用キャスト2", idVerified: true, isSuspended: true }
      );
      await createTestStoreUser(
        { email: "store-count-1@test.com" },
        { name: "カウント用店舗1", isVerified: false }
      );
      await createTestStoreUser(
        { email: "store-count-2@test.com" },
        { name: "カウント用店舗2", isVerified: true }
      );

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.dashboard.getStats();

      // ユーザー数（管理者1 + 非管理者1 + 追加4 = 6）
      expect(result.counts.totalUsers).toBeGreaterThanOrEqual(6);
      // キャスト数（初期1 + 追加2 = 3以上）
      expect(result.counts.totalCasts).toBeGreaterThanOrEqual(3);
      // 店舗数（追加2 = 2以上）
      expect(result.counts.totalStores).toBeGreaterThanOrEqual(2);
      // 未検証キャスト（1以上）
      expect(result.counts.pendingVerifications.casts).toBeGreaterThanOrEqual(
        1
      );
      // 未検証店舗（1以上）
      expect(result.counts.pendingVerifications.stores).toBeGreaterThanOrEqual(
        1
      );
      // 停止中キャスト（1以上）
      expect(result.counts.suspendedCasts).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getRecentActivity", () => {
    it("管理者は最近のアクティビティを取得できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.dashboard.getRecentActivity({
        limit: 5,
      });

      expect(result).toBeDefined();
      expect(result.recentUsers).toBeDefined();
      expect(Array.isArray(result.recentUsers)).toBe(true);
      expect(result.recentMatches).toBeDefined();
      expect(Array.isArray(result.recentMatches)).toBe(true);
      expect(result.recentInterviews).toBeDefined();
      expect(Array.isArray(result.recentInterviews)).toBe(true);
    });

    it("デフォルトのlimitで取得できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.dashboard.getRecentActivity({});

      expect(result.recentUsers.length).toBeLessThanOrEqual(10);
      expect(result.recentMatches.length).toBeLessThanOrEqual(10);
      expect(result.recentInterviews.length).toBeLessThanOrEqual(10);
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.dashboard.getRecentActivity({})
      ).rejects.toThrow(TRPCError);
    });

    it("未認証ユーザーはアクセスできない", async () => {
      const caller = createUnauthenticatedCaller();

      await expect(
        caller.admin.dashboard.getRecentActivity({})
      ).rejects.toThrow(TRPCError);
    });
  });
});

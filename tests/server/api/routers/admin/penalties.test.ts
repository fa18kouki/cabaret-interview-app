import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import {
  createAdminCaller,
  createNonAdminCaller,
  createTestAdminUser,
  createTestCastUser,
  cleanupTestData,
  prisma,
} from "./__helpers__/setup";

describe("admin.penalties", () => {
  let adminUserId: string;
  let nonAdminUserId: string;
  let testCastUserId: string;

  beforeAll(async () => {
    await cleanupTestData();

    const adminUser = await createTestAdminUser({
      id: "admin-penalties-test",
      email: "admin-penalties@test.com",
    });
    adminUserId = adminUser.id;

    const castUser = await createTestCastUser(
      { id: "cast-penalties-test", email: "cast-penalties@test.com" },
      { nickname: "テストキャスト" }
    );
    nonAdminUserId = castUser.id;
    testCastUserId = castUser.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("list", () => {
    beforeEach(async () => {
      await prisma.penalty.deleteMany({});
    });

    it("管理者はペナルティ一覧を取得できる", async () => {
      // ペナルティを作成
      await prisma.penalty.create({
        data: {
          userId: testCastUserId,
          type: "NO_SHOW",
          reason: "テストペナルティ",
        },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.list({});

      expect(result).toBeDefined();
      expect(result.penalties).toBeDefined();
      expect(Array.isArray(result.penalties)).toBe(true);
      expect(result.penalties.length).toBeGreaterThanOrEqual(1);
    });

    it("タイプでフィルターできる", async () => {
      await prisma.penalty.create({
        data: { userId: testCastUserId, type: "NO_SHOW", reason: "無断欠席" },
      });
      await prisma.penalty.create({
        data: { userId: testCastUserId, type: "SPAM", reason: "スパム" },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.list({ type: "NO_SHOW" });

      result.penalties.forEach((penalty) => {
        expect(penalty.type).toBe("NO_SHOW");
      });
    });

    it("ユーザーIDでフィルターできる", async () => {
      await prisma.penalty.create({
        data: { userId: testCastUserId, type: "SPAM", reason: "テスト" },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.list({
        userId: testCastUserId,
      });

      result.penalties.forEach((penalty) => {
        expect(penalty.userId).toBe(testCastUserId);
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(caller.admin.penalties.list({})).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("add", () => {
    it("管理者はペナルティを追加できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.add({
        userId: testCastUserId,
        type: "INAPPROPRIATE_CONTENT",
        reason: "不適切なコンテンツ",
      });

      expect(result.penalty).toBeDefined();
      expect(result.penalty.userId).toBe(testCastUserId);
      expect(result.penalty.type).toBe("INAPPROPRIATE_CONTENT");
    });

    it("キャストの場合はpenaltyCountが増加する", async () => {
      const beforeCount =
        (await prisma.cast.findUnique({
          where: { userId: testCastUserId },
        }))?.penaltyCount ?? 0;

      const caller = createAdminCaller(adminUserId);
      await caller.admin.penalties.add({
        userId: testCastUserId,
        type: "NO_SHOW",
        reason: "無断欠席",
      });

      const afterCount =
        (await prisma.cast.findUnique({
          where: { userId: testCastUserId },
        }))?.penaltyCount ?? 0;

      expect(afterCount).toBe(beforeCount + 1);
    });

    it("存在しないユーザーはNOT_FOUNDエラー", async () => {
      const caller = createAdminCaller(adminUserId);

      await expect(
        caller.admin.penalties.add({
          userId: "non-existent-id",
          type: "SPAM",
        })
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.penalties.add({
          userId: testCastUserId,
          type: "SPAM",
        })
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("getByUser", () => {
    beforeEach(async () => {
      await prisma.penalty.deleteMany({});
      await prisma.penalty.create({
        data: { userId: testCastUserId, type: "NO_SHOW", reason: "テスト1" },
      });
      await prisma.penalty.create({
        data: { userId: testCastUserId, type: "SPAM", reason: "テスト2" },
      });
    });

    it("管理者はユーザーのペナルティ履歴を取得できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.getByUser({
        userId: testCastUserId,
      });

      expect(result.penalties).toBeDefined();
      expect(result.penalties.length).toBe(2);
      expect(result.totalCount).toBe(2);
    });

    it("存在しないユーザーは空の結果", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.penalties.getByUser({
        userId: "non-existent-id",
      });

      expect(result.penalties.length).toBe(0);
      expect(result.totalCount).toBe(0);
    });
  });
});

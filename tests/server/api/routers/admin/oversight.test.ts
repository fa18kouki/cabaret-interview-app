import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import {
  createAdminCaller,
  createNonAdminCaller,
  createTestAdminUser,
  createTestCastUser,
  createTestStoreUser,
  cleanupTestData,
  prisma,
} from "./__helpers__/setup";

describe("admin.oversight", () => {
  let adminUserId: string;
  let nonAdminUserId: string;
  let testCastId: string;
  let testStoreId: string;

  beforeAll(async () => {
    await cleanupTestData();

    const adminUser = await createTestAdminUser({
      id: "admin-oversight-test",
      email: "admin-oversight@test.com",
    });
    adminUserId = adminUser.id;

    const castUser = await createTestCastUser(
      { id: "cast-oversight-test", email: "cast-oversight@test.com" },
      { nickname: "テストキャスト" }
    );
    nonAdminUserId = castUser.id;
    testCastId = castUser.cast.id;

    const storeUser = await createTestStoreUser(
      { email: "store-oversight@test.com" },
      { name: "テスト店舗" }
    );
    testStoreId = storeUser.store.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("listMatches", () => {
    beforeEach(async () => {
      await prisma.match.deleteMany({});
    });

    it("管理者はマッチング一覧を取得できる", async () => {
      // マッチングを作成
      await prisma.match.create({
        data: {
          castId: testCastId,
          storeId: testStoreId,
          status: "ACCEPTED",
        },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.oversight.listMatches({});

      expect(result).toBeDefined();
      expect(result.matches).toBeDefined();
      expect(Array.isArray(result.matches)).toBe(true);
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
    });

    it("ステータスでフィルターできる", async () => {
      await prisma.match.create({
        data: { castId: testCastId, storeId: testStoreId, status: "PENDING" },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.oversight.listMatches({
        status: "PENDING",
      });

      result.matches.forEach((match) => {
        expect(match.status).toBe("PENDING");
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.oversight.listMatches({})
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("listInterviews", () => {
    let testOfferId: string;

    beforeEach(async () => {
      await prisma.interview.deleteMany({});
      await prisma.offer.deleteMany({});

      // オファーを作成
      const offer = await prisma.offer.create({
        data: {
          storeId: testStoreId,
          castId: testCastId,
          message: "テストオファー",
          status: "ACCEPTED",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      testOfferId = offer.id;
    });

    it("管理者は面接一覧を取得できる", async () => {
      await prisma.interview.create({
        data: {
          offerId: testOfferId,
          castId: testCastId,
          storeId: testStoreId,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "SCHEDULED",
        },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.oversight.listInterviews({});

      expect(result).toBeDefined();
      expect(result.interviews).toBeDefined();
      expect(Array.isArray(result.interviews)).toBe(true);
      expect(result.interviews.length).toBeGreaterThanOrEqual(1);
    });

    it("ステータスでフィルターできる", async () => {
      await prisma.interview.create({
        data: {
          offerId: testOfferId,
          castId: testCastId,
          storeId: testStoreId,
          scheduledAt: new Date(),
          status: "NO_SHOW",
        },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.oversight.listInterviews({
        status: "NO_SHOW",
      });

      result.interviews.forEach((interview) => {
        expect(interview.status).toBe("NO_SHOW");
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.oversight.listInterviews({})
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("updateInterviewStatus", () => {
    let testInterviewId: string;
    let testOfferId: string;

    beforeEach(async () => {
      await prisma.interview.deleteMany({});
      await prisma.offer.deleteMany({});

      const offer = await prisma.offer.create({
        data: {
          storeId: testStoreId,
          castId: testCastId,
          message: "テストオファー",
          status: "ACCEPTED",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      testOfferId = offer.id;

      const interview = await prisma.interview.create({
        data: {
          offerId: testOfferId,
          castId: testCastId,
          storeId: testStoreId,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "SCHEDULED",
        },
      });
      testInterviewId = interview.id;
    });

    it("管理者は面接ステータスを更新できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.oversight.updateInterviewStatus({
        interviewId: testInterviewId,
        status: "COMPLETED",
        notes: "管理者による更新",
      });

      expect(result.interview.id).toBe(testInterviewId);
      expect(result.interview.status).toBe("COMPLETED");
    });

    it("存在しない面接はNOT_FOUNDエラー", async () => {
      const caller = createAdminCaller(adminUserId);

      await expect(
        caller.admin.oversight.updateInterviewStatus({
          interviewId: "non-existent-id",
          status: "COMPLETED",
        })
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.oversight.updateInterviewStatus({
          interviewId: testInterviewId,
          status: "COMPLETED",
        })
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });
});

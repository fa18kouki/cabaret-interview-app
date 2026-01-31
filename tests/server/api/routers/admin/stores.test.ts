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

describe("admin.stores", () => {
  let adminUserId: string;
  let nonAdminUserId: string;

  beforeAll(async () => {
    await cleanupTestData();

    const adminUser = await createTestAdminUser({
      id: "admin-stores-test",
      email: "admin-stores@test.com",
    });
    adminUserId = adminUser.id;

    const castUser = await createTestCastUser(
      { id: "cast-stores-test", email: "cast-stores@test.com" },
      { nickname: "テストキャスト" }
    );
    nonAdminUserId = castUser.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("list", () => {
    beforeEach(async () => {
      await prisma.store.deleteMany({});
    });

    it("管理者は店舗一覧を取得できる", async () => {
      await createTestStoreUser(
        { email: "store1@test.com" },
        { name: "テスト店舗1", area: "銀座" }
      );

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.list({});

      expect(result).toBeDefined();
      expect(result.stores).toBeDefined();
      expect(Array.isArray(result.stores)).toBe(true);
      expect(result.stores.length).toBeGreaterThanOrEqual(1);
    });

    it("検証状態でフィルターできる", async () => {
      await createTestStoreUser(
        { email: "verified-store@test.com" },
        { name: "認証済み店舗", isVerified: true }
      );
      await createTestStoreUser(
        { email: "unverified-store@test.com" },
        { name: "未認証店舗", isVerified: false }
      );

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.list({ isVerified: true });

      result.stores.forEach((store) => {
        expect(store.isVerified).toBe(true);
      });
    });

    it("エリアでフィルターできる", async () => {
      await createTestStoreUser(
        { email: "ginza-store@test.com" },
        { name: "銀座店舗", area: "銀座" }
      );
      await createTestStoreUser(
        { email: "roppongi-store@test.com" },
        { name: "六本木店舗", area: "六本木" }
      );

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.list({ area: "銀座" });

      result.stores.forEach((store) => {
        expect(store.area).toBe("銀座");
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(caller.admin.stores.list({})).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });

  describe("getById", () => {
    let testStoreId: string;

    beforeAll(async () => {
      const storeUser = await createTestStoreUser(
        { email: "getbyid-store@test.com" },
        { name: "詳細テスト店舗" }
      );
      testStoreId = storeUser.store.id;
    });

    it("管理者は店舗詳細を取得できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.getById({ storeId: testStoreId });

      expect(result).toBeDefined();
      expect(result.id).toBe(testStoreId);
      expect(result.name).toBe("詳細テスト店舗");
    });

    it("存在しない店舗はNOT_FOUNDエラー", async () => {
      const caller = createAdminCaller(adminUserId);

      await expect(
        caller.admin.stores.getById({ storeId: "non-existent-id" })
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });
  });

  describe("verify", () => {
    let unverifiedStoreId: string;

    beforeEach(async () => {
      const storeUser = await createTestStoreUser(
        { email: `verify-store-${Date.now()}@test.com` },
        { name: "認証待ち店舗", isVerified: false }
      );
      unverifiedStoreId = storeUser.store.id;
    });

    it("管理者は店舗を認証できる", async () => {
      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.verify({
        storeId: unverifiedStoreId,
        verified: true,
      });

      expect(result.id).toBe(unverifiedStoreId);
      expect(result.isVerified).toBe(true);
    });

    it("認証を取り消せる", async () => {
      await prisma.store.update({
        where: { id: unverifiedStoreId },
        data: { isVerified: true },
      });

      const caller = createAdminCaller(adminUserId);
      const result = await caller.admin.stores.verify({
        storeId: unverifiedStoreId,
        verified: false,
      });

      expect(result.isVerified).toBe(false);
    });

    it("存在しない店舗はNOT_FOUNDエラー", async () => {
      const caller = createAdminCaller(adminUserId);

      await expect(
        caller.admin.stores.verify({
          storeId: "non-existent-id",
          verified: true,
        })
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });

    it("非管理者はアクセスできない", async () => {
      const caller = createNonAdminCaller(nonAdminUserId);

      await expect(
        caller.admin.stores.verify({
          storeId: unverifiedStoreId,
          verified: true,
        })
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  });
});

import { describe, it, expect } from "vitest";
import { convertPublicToAuthAnswers } from "@/lib/diagnosis/session-migration";
import type { DiagnosisAnswers as PublicAnswers } from "@/lib/diagnosis-session";

describe("convertPublicToAuthAnswers", () => {
  it("totalExperienceYears を数値に変換する", () => {
    const publicAnswers: PublicAnswers = { totalExperienceYears: 5 };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.totalExperienceYears).toBe(5);
  });

  it("desiredAreas をそのまま配列で引き継ぐ", () => {
    const publicAnswers: PublicAnswers = { desiredAreas: ["銀座", "六本木"] };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.desiredAreas).toEqual(["銀座", "六本木"]);
  });

  it("desiredHourlyRate を previousHourlyRate として設定する", () => {
    const publicAnswers: PublicAnswers = {
      desiredHourlyRate: 5000,
      previousHourlyRate: 4000,
    };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.desiredHourlyRate).toBe(5000);
    expect(result.previousHourlyRate).toBe(4000);
  });

  it("availableDaysPerWeek を数値で引き継ぐ", () => {
    const publicAnswers: PublicAnswers = { availableDaysPerWeek: 3 };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.availableDaysPerWeek).toBe(3);
  });

  it("alcoholTolerance を文字列で引き継ぐ", () => {
    const publicAnswers: PublicAnswers = { alcoholTolerance: "STRONG" };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.alcoholTolerance).toBe("STRONG");
  });

  it("preferredAtmosphere を配列で引き継ぐ", () => {
    const publicAnswers: PublicAnswers = {
      preferredAtmosphere: ["落ち着いた店"],
    };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.preferredAtmosphere).toEqual(["落ち着いた店"]);
  });

  it("未設定フィールドは undefined として扱われる", () => {
    const publicAnswers: PublicAnswers = {};
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.totalExperienceYears).toBeUndefined();
    expect(result.desiredAreas).toBeUndefined();
    expect(result.desiredHourlyRate).toBeUndefined();
  });

  it("全フィールドが設定された場合でも正しく変換する", () => {
    const publicAnswers: PublicAnswers = {
      totalExperienceYears: 2,
      previousHourlyRate: 5000,
      desiredAreas: ["新宿"],
      desiredHourlyRate: 6000,
      availableDaysPerWeek: 4,
      alcoholTolerance: "MODERATE",
      preferredAtmosphere: ["ワイワイ系"],
      strengths: ["コミュニケーション力"],
    };
    const result = convertPublicToAuthAnswers(publicAnswers);
    expect(result.totalExperienceYears).toBe(2);
    expect(result.previousHourlyRate).toBe(5000);
    expect(result.desiredAreas).toEqual(["新宿"]);
    expect(result.desiredHourlyRate).toBe(6000);
    expect(result.availableDaysPerWeek).toBe(4);
    expect(result.alcoholTolerance).toBe("MODERATE");
    expect(result.preferredAtmosphere).toEqual(["ワイワイ系"]);
  });
});

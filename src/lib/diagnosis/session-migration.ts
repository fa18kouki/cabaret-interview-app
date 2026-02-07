/**
 * 公開診断の回答を認証済み診断の型に変換する
 */
import type { DiagnosisAnswers as PublicAnswers } from "@/lib/diagnosis-session";
import type { DiagnosisAnswers as AuthAnswers } from "./types";

/**
 * 公開診断の回答を認証済み診断の型に変換する。
 * フィールド名は両方のシステムで統一済みのため、そのまま引き継ぐ。
 * 未設定フィールドは結果に含めない。
 */
export function convertPublicToAuthAnswers(
  publicAnswers: PublicAnswers
): Partial<AuthAnswers> {
  const result: Partial<AuthAnswers> = {};

  if (publicAnswers.totalExperienceYears !== undefined) {
    result.totalExperienceYears = publicAnswers.totalExperienceYears;
  }

  if (publicAnswers.previousHourlyRate !== undefined) {
    result.previousHourlyRate = publicAnswers.previousHourlyRate;
  }

  if (publicAnswers.alcoholTolerance !== undefined) {
    result.alcoholTolerance = publicAnswers.alcoholTolerance;
  }

  if (publicAnswers.desiredAreas !== undefined) {
    result.desiredAreas = publicAnswers.desiredAreas;
  }

  if (publicAnswers.desiredHourlyRate !== undefined) {
    result.desiredHourlyRate = publicAnswers.desiredHourlyRate;
  }

  if (publicAnswers.availableDaysPerWeek !== undefined) {
    result.availableDaysPerWeek = publicAnswers.availableDaysPerWeek;
  }

  if (publicAnswers.preferredAtmosphere !== undefined) {
    result.preferredAtmosphere = publicAnswers.preferredAtmosphere;
  }

  return result;
}

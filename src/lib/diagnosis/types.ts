/**
 * AI診断システムの型定義
 */

// 診断ステップ
export type DiagnosisStep =
  | "BASIC_INFO"
  | "CONTACT"
  | "EXPERIENCE"
  | "PREFERENCES"
  | "SELF_PR"
  | "AVAILABILITY";

// 質問タイプ
export type QuestionType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "photo"
  | "boolean";

// 選択肢
export interface QuestionOption {
  id: string;
  label: string;
  value: string | number | boolean;
}

// バリデーション設定
export interface QuestionValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// 質問定義
export interface Question {
  id: string;
  step: DiagnosisStep;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  placeholder?: string;
  validation?: QuestionValidation;
  skipCondition?: (answers: DiagnosisAnswers) => boolean;
  followUp?: string; // 回答後のAIレスポンス
}

// 回答値の型
export type AnswerValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | null;

// 診断回答
export interface DiagnosisAnswers {
  // 基本情報
  nickname?: string;
  age?: number;
  birthDate?: string;
  photos?: string[];

  // 連絡先
  instagramId?: string;
  lineId?: string;
  currentListingUrl?: string;

  // 経験・スキル
  totalExperienceYears?: number;
  experienceAreas?: string[];
  experienceBusinessTypes?: string[];
  previousHourlyRate?: number;
  monthlySales?: number;
  monthlyNominations?: number;
  alcoholTolerance?: string;

  // 希望条件
  desiredAreas?: string[];
  desiredHourlyRate?: number;
  desiredMonthlyIncome?: number;
  availableDaysPerWeek?: number;
  preferredAtmosphere?: string[];
  preferredClientele?: string[];

  // 自己PR
  birthdaySales?: number;
  hasVipClients?: boolean;
  vipClientDescription?: string;
  socialFollowers?: number;

  // 稼働状況
  isAvailableNow?: boolean;
  downtimeUntil?: string;

  // その他（動的に追加されるフィールド用）
  [key: string]: AnswerValue | undefined;
}

// チャットメッセージ
export interface ChatMessage {
  id: string;
  type: "ai" | "user";
  content: string;
  options?: QuestionOption[];
  timestamp: Date;
  questionId?: string;
}

// 診断セッション状態
export interface DiagnosisSessionState {
  sessionId: string | null;
  currentStep: DiagnosisStep;
  currentQuestionIndex: number;
  answers: DiagnosisAnswers;
  messages: ChatMessage[];
  isTyping: boolean;
  isCompleted: boolean;
}

// 進捗情報
export interface DiagnosisProgress {
  current: number;
  total: number;
  percentage: number;
  currentStep: DiagnosisStep;
  completedSteps: DiagnosisStep[];
}

// ステップ情報
export interface StepInfo {
  step: DiagnosisStep;
  label: string;
  questionCount: number;
}

// API用の型
export interface SaveAnswerInput {
  questionId: string;
  value: AnswerValue;
}

export interface DiagnosisSessionData {
  id: string;
  castId: string;
  currentStep: string;
  answers: DiagnosisAnswers;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

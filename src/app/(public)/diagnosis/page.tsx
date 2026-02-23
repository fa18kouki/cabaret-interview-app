"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DiagnosisChat,
  StepIndicator,
  type ChatMessage,
  type ChatOption,
} from "@/components/diagnosis/DiagnosisChat";
import { useDiagnosis } from "@/lib/diagnosis-provider";
import type { DiagnosisAnswers } from "@/lib/diagnosis-session";

// 質問定義
interface Question {
  id: keyof DiagnosisAnswers | string;
  content: string;
  options: ChatOption[];
  followUp?: (answer: string) => string;
}

const QUESTIONS: Question[] = [
  {
    id: "greeting",
    content:
      "こんにちは！LUMINA AI診断へようこそ✨\n\nあなたにぴったりの時給とお店を診断します。\n\n登録不要・30秒で完了します。さっそく始めましょう！",
    options: [{ id: "start", label: "診断をはじめる", value: "start" }],
  },
  {
    id: "totalExperienceYears",
    content: "夜職の経験はありますか？",
    options: [
      { id: "0", label: "未経験", value: "0" },
      { id: "0.5", label: "1年未満", value: "0.5" },
      { id: "2", label: "1〜3年", value: "2" },
      { id: "5", label: "3年以上", value: "5" },
    ],
    followUp: (answer) => {
      if (answer === "0") return "未経験なんですね！初めてでも安心のお店をご紹介しますね😊";
      if (answer === "5") return "経験豊富ですね！高時給のお店をご紹介できそうです✨";
      return "なるほど、ありがとうございます！";
    },
  },
  {
    id: "desiredAreas",
    content: "働きたいエリアはどこですか？",
    options: [
      { id: "ginza", label: "銀座", value: "銀座" },
      { id: "roppongi", label: "六本木", value: "六本木" },
      { id: "shinjuku", label: "新宿", value: "新宿" },
      { id: "shibuya", label: "渋谷", value: "渋谷" },
    ],
    followUp: (answer) => `${answer}エリアですね！人気のエリアです👍`,
  },
  {
    id: "desiredHourlyRate",
    content: "希望の時給を教えてください",
    options: [
      { id: "3000", label: "3,000円以上", value: "3000" },
      { id: "4000", label: "4,000円以上", value: "4000" },
      { id: "5000", label: "5,000円以上", value: "5000" },
      { id: "6000", label: "6,000円以上", value: "6000" },
    ],
    followUp: () => "ありがとうございます！",
  },
  {
    id: "availableDaysPerWeek",
    content: "週に何日くらい働きたいですか？",
    options: [
      { id: "1", label: "週1〜2日", value: "1.5" },
      { id: "3", label: "週3日", value: "3" },
      { id: "4", label: "週4〜5日", value: "4.5" },
      { id: "6", label: "週6日以上", value: "6" },
    ],
    followUp: () => "了解しました！",
  },
  {
    id: "alcoholTolerance",
    content: "お酒の強さを教えてください",
    options: [
      { id: "none", label: "飲めない", value: "NONE" },
      { id: "weak", label: "弱い", value: "WEAK" },
      { id: "moderate", label: "普通", value: "MODERATE" },
      { id: "strong", label: "強い", value: "STRONG" },
    ],
    followUp: () => "了解しました！",
  },
  {
    id: "preferredAtmosphere",
    content: "希望のお店の雰囲気は？",
    options: [
      { id: "calm", label: "落ち着いた店", value: "落ち着いた店" },
      { id: "lively", label: "ワイワイ系", value: "ワイワイ系" },
      { id: "elegant", label: "高級感のある店", value: "高級感のある店" },
      { id: "casual", label: "カジュアル", value: "カジュアルな店" },
    ],
    followUp: () => "あなたに合ったお店を探しますね！",
  },
  {
    id: "strengths",
    content: "あなたの強みは？",
    options: [
      { id: "communication", label: "コミュ力", value: "コミュニケーション力" },
      { id: "appearance", label: "容姿", value: "容姿" },
      { id: "experience", label: "接客経験", value: "接客経験" },
      { id: "personality", label: "明るい性格", value: "明るい性格" },
    ],
    followUp: () =>
      "素敵ですね！✨\n\nこれで診断に必要な情報が揃いました！\n結果を計算しています...",
  },
];

export default function DiagnosisPage() {
  const router = useRouter();
  const { session, startDiagnosis, addAnswers, completeInterview } =
    useDiagnosis();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化
  useEffect(() => {
    if (!isInitialized) {
      // 新しいセッションを開始
      startDiagnosis();

      // 最初の質問を表示
      const firstQuestion = QUESTIONS[0];
      setTimeout(() => {
        setMessages([
          {
            id: `ai-${Date.now()}`,
            type: "ai",
            content: firstQuestion.content,
            options: firstQuestion.options,
            timestamp: new Date(),
          },
        ]);
        setIsInitialized(true);
      }, 500);
    }
  }, [isInitialized, startDiagnosis]);

  // 選択肢クリック時の処理
  const handleSelectOption = useCallback(
    (option: ChatOption) => {
      const currentQuestion = QUESTIONS[currentQuestionIndex];

      // ユーザーの回答をメッセージに追加
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: "user",
          content: option.label,
          timestamp: new Date(),
        },
      ]);

      // 回答を保存（greeting以外）
      if (currentQuestion.id === "greeting") {
        // 挨拶は保存しない
      } else if (currentQuestion.id === "strengths") {
        addAnswers({ strengths: [option.value] });
      } else if (currentQuestion.id === "desiredAreas") {
        addAnswers({ desiredAreas: [option.value] });
      } else if (currentQuestion.id === "preferredAtmosphere") {
        addAnswers({ preferredAtmosphere: [option.value] });
      } else {
        const answerKey = currentQuestion.id as keyof DiagnosisAnswers;
        addAnswers({ [answerKey]: parseFloat(option.value) || option.value });
      }

      // 次の質問へ
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < QUESTIONS.length) {
        // フォローアップメッセージと次の質問
        setIsTyping(true);

        setTimeout(() => {
          const followUp = currentQuestion.followUp?.(option.value);
          if (followUp) {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-followup-${Date.now()}`,
                type: "ai",
                content: followUp,
                timestamp: new Date(),
              },
            ]);
          }

          setTimeout(() => {
            const nextQuestion = QUESTIONS[nextIndex];
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                type: "ai",
                content: nextQuestion.content,
                options: nextQuestion.options,
                timestamp: new Date(),
              },
            ]);
            setCurrentQuestionIndex(nextIndex);
            setIsTyping(false);
          }, 800);
        }, 600);
      } else {
        // 診断完了
        setIsTyping(true);

        setTimeout(() => {
          const followUp = currentQuestion.followUp?.(option.value);
          if (followUp) {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-followup-${Date.now()}`,
                type: "ai",
                content: followUp,
                timestamp: new Date(),
              },
            ]);
          }

          // 結果を計算
          completeInterview();

          setTimeout(() => {
            setIsTyping(false);
            // 結果ページへ遷移
            router.push("/diagnosis/result");
          }, 2000);
        }, 600);
      }
    },
    [currentQuestionIndex, addAnswers, completeInterview, router]
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            LUMINA
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ログイン済みの方はこちら
            </Link>
            <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              登録不要・30秒で診断
            </span>
          </div>
        </div>
      </header>

      {/* 進捗バー */}
      <div className="bg-black px-4 py-3">
        <div className="max-w-lg mx-auto">
          <StepIndicator
            currentStep={Math.min(currentQuestionIndex + 1, QUESTIONS.length)}
            totalSteps={QUESTIONS.length}
          />
        </div>
      </div>

      {/* チャットエリア */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-4">
        <DiagnosisChat
          messages={messages}
          onSelectOption={handleSelectOption}
          isTyping={isTyping}
          className="h-[calc(100vh-180px)]"
        />
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSession } from "@/lib/demo-session";
import { ChevronLeft, MoreHorizontal, Send } from "lucide-react";
import { ChatBubble } from "@/components/cast/ChatBubble";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  choices?: string[];
}

// サンプルメッセージフロー
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content:
      "あなたにぴったりのお店を見つけましょう！✨\nまず、希望のエリアを教えてください",
    isAI: true,
    choices: ["渋谷", "六本木", "銀座", "新宿"],
  },
];

const FLOW_MESSAGES: Record<string, Message[]> = {
  渋谷: [
    {
      id: "user-area",
      content: "渋谷周辺がいいです！",
      isAI: false,
    },
    {
      id: "ai-salary",
      content: "渋谷ですね！了解しました😊\n希望の時給はどのくらいですか？",
      isAI: true,
      choices: ["3,000円〜", "4,000円〜", "5,000円〜"],
    },
  ],
  六本木: [
    {
      id: "user-area",
      content: "六本木で探しています！",
      isAI: false,
    },
    {
      id: "ai-salary",
      content: "六本木ですね！高級店が多いエリアです✨\n希望の時給はどのくらいですか？",
      isAI: true,
      choices: ["4,000円〜", "5,000円〜", "6,000円〜"],
    },
  ],
  銀座: [
    {
      id: "user-area",
      content: "銀座で働きたいです！",
      isAI: false,
    },
    {
      id: "ai-salary",
      content: "銀座ですね！上品なお店が多いですよ✨\n希望の時給はどのくらいですか？",
      isAI: true,
      choices: ["4,000円〜", "5,000円〜", "6,000円〜"],
    },
  ],
  新宿: [
    {
      id: "user-area",
      content: "新宿がいいです！",
      isAI: false,
    },
    {
      id: "ai-salary",
      content: "新宿ですね！アクセス抜群ですね😊\n希望の時給はどのくらいですか？",
      isAI: true,
      choices: ["3,000円〜", "4,000円〜", "5,000円〜"],
    },
  ],
};

const SALARY_RESPONSE: Message[] = [
  {
    id: "ai-result",
    content:
      "ありがとうございます！\nあなたにぴったりのお店を3件見つけました🎉\n\n「検索」タブからおすすめ店舗をチェックしてみてくださいね！",
    isAI: true,
  },
];

export default function AIDiagnosisPage() {
  const router = useRouter();
  const { data: session, status } = useAppSession();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<"area" | "salary" | "done">("area");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "CAST")) {
      if (status === "unauthenticated") router.push("/login");
      else if (session?.user.role !== "CAST") router.push("/store/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading" || !session || session.user.role !== "CAST") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--primary)" />
      </div>
    );
  }

  const handleChoiceClick = (choice: string) => {
    if (step === "area") {
      const flowMessages = FLOW_MESSAGES[choice] || FLOW_MESSAGES["渋谷"];
      setMessages((prev) => [...prev, ...flowMessages]);
      setStep("salary");
    } else if (step === "salary") {
      setMessages((prev) => [
        ...prev,
        { id: `user-salary-${Date.now()}`, content: choice, isAI: false },
        ...SALARY_RESPONSE,
      ]);
      setStep("done");
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // デモ用: 簡単な応答を追加
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content:
            "ありがとうございます！ご質問やご希望があれば、お気軽にお伝えくださいね😊",
          isAI: true,
        },
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-85px)] -m-4 md:-m-8 bg-[#FFF9FC]">
      {/* ヘッダー */}
      <div className="bg-gradient-to-b from-(--primary-bg) to-white px-5 pt-4 pb-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-(--text-main)" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-(--text-main)">
          AI適職診断
        </h1>
        <button>
          <MoreHorizontal className="w-6 h-6 text-(--text-main)" />
        </button>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            isAI={message.isAI}
            choices={message.choices}
            onChoiceClick={handleChoiceClick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 flex gap-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="w-11 h-11 bg-(--primary) rounded-full flex items-center justify-center"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

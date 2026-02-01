"use client";

import { Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
  choices?: string[];
  onChoiceClick?: (choice: string) => void;
}

export function ChatBubble({
  message,
  isAI = false,
  choices = [],
  onChoiceClick,
}: ChatBubbleProps) {
  if (isAI) {
    return (
      <div className="flex gap-2.5 max-w-[85%]">
        {/* AIアバター */}
        <div className="w-9 h-9 rounded-full bg-(--primary-light) flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          {/* メッセージバブル */}
          <div className="bg-white px-4 py-3.5 rounded-[20px] rounded-bl-[4px] shadow-[var(--shadow-float)] text-sm leading-relaxed text-(--text-main)">
            {message.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < message.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
          {/* 選択肢 */}
          {choices.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-2.5 pl-1">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => onChoiceClick?.(choice)}
                  className="bg-white border border-(--primary) text-(--primary) px-4 py-2 rounded-full text-[13px] font-medium hover:bg-(--primary-bg) transition-colors"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ユーザーメッセージ
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-(--primary) text-white px-4 py-3.5 rounded-[20px] rounded-br-[4px] text-sm leading-relaxed">
        {message}
      </div>
    </div>
  );
}

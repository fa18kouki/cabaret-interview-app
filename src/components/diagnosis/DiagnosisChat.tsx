"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  type: "ai" | "user";
  content: string;
  options?: ChatOption[];
  timestamp: Date;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string;
}

interface DiagnosisChatProps {
  messages: ChatMessage[];
  onSelectOption: (option: ChatOption) => void;
  isTyping?: boolean;
  className?: string;
}

export function DiagnosisChat({
  messages,
  onSelectOption,
  isTyping = false,
  className,
}: DiagnosisChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // 新しいメッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 新しいメッセージが追加されたら選択状態をリセット
  useEffect(() => {
    setSelectedOptionId(null);
  }, [messages.length]);

  const handleOptionClick = (option: ChatOption, messageId: string) => {
    setSelectedOptionId(`${messageId}-${option.id}`);
    onSelectOption(option);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gray-900 rounded-2xl overflow-hidden",
        className
      )}
    >
      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isLastAiMessage =
            message.type === "ai" && index === messages.length - 1;

          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  message.type === "user"
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800 text-gray-100"
                )}
              >
                {/* メッセージ本文 */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* 選択肢（最後のAIメッセージのみ操作可能） */}
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option) => {
                      const optionKey = `${message.id}-${option.id}`;
                      const isSelected = selectedOptionId === optionKey;
                      const isDisabled =
                        !isLastAiMessage || selectedOptionId !== null;

                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleOptionClick(option, message.id)
                          }
                          disabled={isDisabled}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            isSelected
                              ? "bg-cyan-500 text-white"
                              : isDisabled
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* タイピングインジケーター */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// 進捗インジケーター
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  className,
}: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">診断進捗</span>
        <span className="text-xs text-gray-400">
          {currentStep} / {totalSteps}
        </span>
      </div>
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

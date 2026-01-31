"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function StoreChatPage() {
  const params = useParams();
  const matchId = params.matchId as string;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: messagesData, isLoading } = trpc.message.getMessages.useQuery(
    { matchId, limit: 50 },
    { refetchInterval: 5000 } // 5秒ごとにポーリング
  );

  const { data: matchesData } = trpc.match.getMatches.useQuery({
    status: "ACCEPTED",
    limit: 1,
  });

  const sendMessage = trpc.message.send.useMutation({
    onSuccess: () => {
      setMessage("");
      utils.message.getMessages.invalidate({ matchId });
    },
  });

  const messages = messagesData?.messages ?? [];
  const currentMatch = matchesData?.matches?.find((m) => m.id === matchId);

  // 新しいメッセージが来たらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate({ matchId, content: message });
  };

  const getRankBadge = (rank: string) => {
    const styles: Record<string, string> = {
      PLATINUM: "bg-purple-100 text-purple-700",
      GOLD: "bg-yellow-100 text-yellow-700",
      SILVER: "bg-gray-200 text-gray-700",
      BRONZE: "bg-orange-100 text-orange-700",
      UNRANKED: "bg-gray-100 text-gray-500",
    };
    const labels: Record<string, string> = {
      PLATINUM: "プラチナ",
      GOLD: "ゴールド",
      SILVER: "シルバー",
      BRONZE: "ブロンズ",
      UNRANKED: "-",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[rank] ?? styles.UNRANKED}`}>
        {labels[rank] ?? "-"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <Link href="/store/matches" className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {currentMatch?.cast?.photos?.[0] ? (
              <img
                src={currentMatch.cast.photos[0]}
                alt={currentMatch.cast.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">
                {currentMatch?.cast?.nickname ?? "キャスト"}
              </p>
              {currentMatch?.cast?.rank && getRankBadge(currentMatch.cast.rank)}
            </div>
            <p className="text-xs text-gray-500">{currentMatch?.cast?.age}歳</p>
          </div>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>メッセージはまだありません</p>
            <p className="text-sm mt-1">最初のメッセージを送ってみましょう</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender.id !== currentMatch?.cast?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isOwn
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <form onSubmit={handleSend} className="pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            isLoading={sendMessage.isPending}
            className="rounded-full px-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}

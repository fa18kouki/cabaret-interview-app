"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSession } from "@/lib/demo-session";
import { useDemoSession } from "@/lib/demo-session";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Thumbnail } from "@/components/ui/thumbnail";
import { trpc } from "@/lib/trpc";
import { getMockChatMessages, getMockChatPartner } from "@/lib/mock-data";
import { ChevronLeft, Send } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;
  const { data: session, status } = useAppSession();
  const { session: demoSession } = useDemoSession();
  const isDemo = !!demoSession;

  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<
    { id: string; content: string; matchId: string; sender: { id: string; role: string }; createdAt: Date }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!isDemo) {
      if (status === "unauthenticated") router.push("/login");
      else if (session && session.user.role !== "CAST") router.push("/store/dashboard");
    }
  }, [isDemo, session, status, router]);

  const { data: messagesData, isLoading } = trpc.message.getMessages.useQuery(
    { matchId, limit: 50 },
    { refetchInterval: 5000, enabled: !isDemo }
  );

  const { data: matchesData } = trpc.match.getMatches.useQuery(
    { status: "ACCEPTED", limit: 1 },
    { enabled: !isDemo }
  );

  const sendMessage = trpc.message.send.useMutation({
    onSuccess: () => {
      setMessage("");
      utils.message.getMessages.invalidate({ matchId });
    },
  });

  // デモ用モックデータ
  const mockPartner = useMemo(
    () => (isDemo ? getMockChatPartner(matchId, "CAST") : null),
    [isDemo, matchId]
  );
  const mockMessages = useMemo(
    () => (isDemo ? getMockChatMessages(matchId, "CAST") : []),
    [isDemo, matchId]
  );

  useEffect(() => {
    if (isDemo) setLocalMessages(mockMessages);
  }, [isDemo, mockMessages]);

  const messages = isDemo
    ? localMessages
    : (messagesData?.messages ?? []);

  const currentMatch = isDemo
    ? null
    : matchesData?.matches?.find((m) => m.id === matchId);

  const partnerName: string = isDemo
    ? (mockPartner && "name" in mockPartner ? (mockPartner.name as string) : "店舗")
    : (currentMatch?.store?.name ?? "店舗");
  const partnerArea = isDemo
    ? (mockPartner && "area" in mockPartner ? (mockPartner.area as string) : null)
    : currentMatch?.store?.area;
  const partnerPhoto = isDemo
    ? (mockPartner && "photos" in mockPartner ? mockPartner.photos?.[0] : undefined)
    : currentMatch?.store?.photos?.[0];
  const partnerId = isDemo
    ? `store_sender_${matchId}`
    : currentMatch?.store?.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDemo) {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `msg_local_${Date.now()}`,
          content: message,
          matchId,
          sender: { id: "cast_self", role: "CAST" },
          createdAt: new Date(),
        },
      ]);
      setMessage("");
    } else {
      sendMessage.mutate({ matchId, content: message });
    }
  };

  if (!isDemo && (status === "loading" || !session || session.user.role !== "CAST" || isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <Link href="/matches" className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <Thumbnail
            src={partnerPhoto}
            alt={partnerName}
            size="sm"
            shape="circle"
            fallbackType="store"
          />
          <div>
            <p className="font-medium text-(--text-main)">{partnerName}</p>
            {partnerArea && <p className="text-xs text-(--text-sub)">{partnerArea}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-(--text-sub) py-8">
            <p>メッセージはまだありません</p>
            <p className="text-sm mt-1">最初のメッセージを送ってみましょう</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender.id !== partnerId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl ${
                    isOwn
                      ? "bg-(--primary) text-white rounded-br-md"
                      : "bg-gray-100 text-(--text-main) rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-white/70" : "text-gray-400"
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

      <form onSubmit={handleSend} className="pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            isLoading={!isDemo && sendMessage.isPending}
            className="rounded-full px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

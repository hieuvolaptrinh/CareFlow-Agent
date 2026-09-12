"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

const starterMessage: Message = {
  id: "welcome",
  role: "model",
  text: "Chào bạn! Mình là CareFlow AI. Bạn muốn hỏi gì hôm nay?",
};

export default function TestAiPage() {
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submitMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .map(({ role, text: messageText }) => ({
              role,
              text: messageText,
            })),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Không thể kết nối tới Gemini.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: data.reply || "Gemini không trả về nội dung.",
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đã xảy ra lỗi không xác định.",
      );
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  const resetChat = () => {
    setMessages([starterMessage]);
    setInput("");
    setError("");
    textareaRef.current?.focus();
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-cyan-950/40">
              <SparkIcon />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight">CareFlow AI</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                Gemini trên Vertex AI
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Cuộc trò chuyện mới
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "model" && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20">
                    <SparkIcon small />
                  </div>
                )}
                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-cyan-600 text-white"
                      : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              </article>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20">
                  <SparkIcon small />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-4">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="size-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: `${index * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="px-4 pb-5 pt-2 sm:px-6 sm:pb-7">
          {error && (
            <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form
            onSubmit={submitMessage}
            className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl focus-within:border-cyan-400/40 focus-within:ring-2 focus-within:ring-cyan-400/10"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn cho Gemini..."
              rows={1}
              disabled={isLoading}
              className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Gửi tin nhắn"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              <SendIcon />
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-slate-600">
            Enter để gửi · Shift + Enter để xuống dòng
          </p>
        </div>
      </section>
    </main>
  );
}

function SparkIcon({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={small ? "size-4" : "size-5"}
    >
      <path
        d="M12 2.75c.75 4.95 3.3 7.5 8.25 8.25-4.95.75-7.5 3.3-8.25 8.25C11.25 14.3 8.7 11.75 3.75 11 8.7 10.25 11.25 7.7 12 2.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="m5 12 14-7-4.5 14-2.75-5.25L5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m11.75 13.75 3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

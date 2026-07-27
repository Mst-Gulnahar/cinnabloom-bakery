"use client";

import { useState, useRef, useEffect, memo } from "react";
import { Send, Sparkles, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "rider";
  text: string;
}

interface RiderChatProps {
  orderContext?: {
    orderId?: string;
    address?: string;
    items?: Array<{ name: string; qty: number; price?: number }>;
    status?: string;
  };
}

function RiderChat({ orderContext }: RiderChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "rider",
      text: "Hey! I'm on my way with your order. Let me know if you need any directions or updates! 🛵",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom only when messages array changes or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: userText };

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, orderContext }),
      });

      const data = await res.json();
      const riderMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "rider",
        text: data.text || "I'm focusing on the road right now, I'll be there shortly!",
      };

      setMessages((prev) => [...prev, riderMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "rider",
          text: "Signal dipped for a moment! Still on the way.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#E5E0D8] rounded-2xl flex flex-col h-[340px] overflow-hidden shadow-sm font-sans">
      {/* Header */}
      <div className="p-3 bg-[#FAF7F2] border-b border-[#E5E0D8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
          <span className="text-xs font-bold text-[#2C2825]">Rider Assistant</span>
        </div>
        <Sparkles size={13} className="text-[#F472B6]" />
      </div>

      {/* Chat History */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs font-medium leading-relaxed ${
                m.sender === "user"
                  ? "bg-[#EAB308] text-white rounded-br-none"
                  : "bg-[#FAF7F2] border border-[#E5E0D8] text-[#4A453E] rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#A39E93] italic pl-2">
            <MessageSquare size={10} className="animate-bounce text-[#F472B6]" />
            Rider is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-2 border-t border-[#E5E0D8] bg-[#FAF7F2] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask rider for ETA or directions..."
          className="flex-1 text-xs px-3 py-2 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#2C2825] focus:outline-none focus:border-[#EAB308] transition-all placeholder:text-[#A39E93]"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2.5 bg-[#EAB308] text-white rounded-xl hover:bg-[#D97706] active:scale-95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

export default memo(RiderChat);
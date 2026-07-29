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
      text: "Arrey Boss! Ami Sohel, apnar Cinnabloom Bakery order niye choltechi! 🛵 Garam garam pouchae dibo, chinta nei!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Localized scroll: keeps scroll contained inside chat box without scrolling entire page
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: userText };

    const updatedHistory = [...messages, userMsg];
    setInput("");
    setMessages(updatedHistory);
    setLoading(true);

    try {
      // Send history array so Sohel retains memory & context
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedHistory.map(({ sender, text }) => ({ sender, text })),
          orderContext,
        }),
      });

      const data = await res.json();
      const riderMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "rider",
        text: data.text || "Boss, signal ektu dip korsilo! Ami ache, almost eshe gechi 🛵",
      };

      setMessages((prev) => [...prev, riderMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "rider",
          text: "Signal dipped for a moment! Still on the way, boss!",
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
          <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#2C2825]">Sohel (Rider) 🛵</span>
            <span className="text-[9px] text-[#8C857B]">Cinnabloom Express</span>
          </div>
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
            Sohel is typing...
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
          placeholder="Ask Sohel for ETA or direction..."
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
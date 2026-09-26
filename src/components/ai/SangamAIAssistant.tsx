'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, ShieldCheck, ChevronUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'Is water contamination reported in Dumka?',
  'How is the 5-factor Priority Score calculated?',
  'How does Jharkhand-First university routing work?',
  'Show projects requiring IoT sensor expertise',
  'How is my Citizen Impact Score calculated?',
];

interface SangamAIAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export function SangamAIAssistant({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen,
}: SangamAIAssistantProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (open) {
      if (controlledOnOpen) controlledOnOpen();
      else setInternalIsOpen(true);
    } else {
      if (controlledOnClose) controlledOnClose();
      else setInternalIsOpen(false);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: 'Namaste! I am **Sangam AI**, the civic intelligence assistant for the Government of Jharkhand (PS26043). Ask me about local challenges, university match scores, or priority calculations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'assistant',
            text: data.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'I could not connect to the civic knowledge engine right now. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button - Desktop (on mobile it is in bottom nav) */}
      <div className="fixed bottom-5 right-5 z-40 hidden md:block">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B192C] to-[#1E3E62] px-4 py-3 text-white shadow-xl ring-2 ring-emerald-400/40 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-900">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                <span>Ask Sangam AI</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-slate-300">Civic Intelligence</div>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Drawer - Responsive Sheet on Mobile, Floating card on Desktop */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col h-[85vh] sm:h-[530px] sm:w-96 sm:inset-x-auto sm:bottom-5 sm:right-5 rounded-t-3xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/10 animate-in fade-in slide-in-from-bottom duration-200 pb-safe">
          {/* Mobile Sheet Grab Bar */}
          <div className="flex justify-center pt-2 sm:hidden bg-[#0B192C] rounded-t-3xl">
            <div className="h-1 w-10 rounded-full bg-slate-500/60" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#0B192C] px-4 py-3 sm:rounded-t-2xl text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-900 font-bold">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Sangam AI Assistant</span>
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-semibold text-emerald-300">
                    PS26043
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Grounded in Jharkhand Platform Data
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Preset Prompts */}
          <div className="border-b border-slate-100 bg-slate-50 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 ${
                    m.sender === 'user'
                      ? 'bg-[#0B192C] text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="h-3 w-3 animate-spin text-emerald-500" />
                Analyzing platform records...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="border-t border-slate-100 p-2.5 bg-slate-50 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about challenges, universities, priority..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="rounded-lg bg-[#0B192C] p-2 text-white hover:bg-[#1E3E62] disabled:opacity-40 transition"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

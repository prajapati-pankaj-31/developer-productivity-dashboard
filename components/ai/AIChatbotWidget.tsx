'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Task } from '@/types';
import { ApiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  Zap,
  Code2,
  ArrowDown,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

interface AIChatbotWidgetProps {
  currentUser: User | null;
  tasks?: Task[];
  onOpenStandupModal?: () => void;
  onOpenFullPage?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  '⚡ How can I optimize sprint velocity and task backlog?',
  '🛡️ How to architect JWT refresh token rotation?',
  '🚀 Suggest 3 sprint tasks for payment gateway integration',
  '🐘 How to optimize slow PostgreSQL queries with indexes?',
];

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({
  currentUser,
  tasks = [],
  onOpenStandupModal,
  onOpenFullPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello **${currentUser?.name || 'Developer'}**! 👋\n\nI'm your **DevHub AI Copilot** powered by high-speed Groq LPU inference. I have context on your active tasks (${tasks.length} tasks). How can I assist with your code, architecture, or sprint today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Summarize active sprint tasks',
        'Help me plan Next.js architecture',
        'Show PostgreSQL indexing tips',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const activeTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiClient.chatWithAI({
        messages: historyPayload,
        context: {
          userName: currentUser?.name || 'Developer',
          userRole: currentUser?.role || 'Full Stack Engineer',
          activeTasksCount,
          projectsCount: 4,
          recentTasks: tasks.slice(0, 5).map((t) => t.title),
        },
      });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an issue processing your request. Please check your network or try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. What engineering challenge can I help you with now, ${currentUser?.name || 'Developer'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: DEFAULT_SUGGESTIONS.slice(0, 3),
      },
    ]);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Simple Markdown renderer helper for chat messages
  const renderMessageContent = (content: string) => {
    // Check if message contains code blocks ```...```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        const language = codeLines[0].trim();
        const actualCode = (language && !language.includes(' ') ? codeLines.slice(1) : codeLines).join('\n');
        const blockId = `code-block-${index}`;

        return (
          <div key={index} className="my-2.5 rounded-lg border border-indigo-900/60 bg-[#080a18] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-950/40 border-b border-indigo-900/40 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <Code2 className="h-3 w-3 text-indigo-400" />
                <span>{language || 'code'}</span>
              </span>
              <button
                onClick={() => handleCopyCode(actualCode, blockId)}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                {copiedCodeId === blockId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-zinc-200 overflow-x-auto leading-relaxed">
              <code>{actualCode}</code>
            </pre>
          </div>
        );
      }

      // Normal text with bold & bullet formatting
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1" />;

            // Bullet line
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
              const bulletText = line.trim().replace(/^[-•*]\s*/, '');
              return (
                <div key={lIdx} className="flex items-start gap-1.5 pl-1">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatBold(bulletText) }} />
                </div>
              );
            }

            return (
              <p
                key={lIdx}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatBold(line) }}
              />
            );
          })}
        </div>
      );
    });
  };

  const formatBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-100">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]">$1</code>');
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open DevHub AI Copilot Chatbot"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-3.5 sm:px-4 sm:py-3 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/40"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 blur-xs group-hover:opacity-100 transition-opacity animate-pulse" />
            
            <div className="relative flex items-center gap-2">
              <div className="p-1 rounded-full bg-white/10">
                <Bot className="h-5 w-5 text-white animate-bounce duration-1000" />
              </div>
              <span className="hidden sm:inline font-semibold text-xs tracking-wide text-white drop-shadow-sm">
                DevHub AI Copilot
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-400/30 text-indigo-200">
                <Zap className="h-2.5 w-2.5 text-amber-300 fill-amber-300" />
                <span>Groq</span>
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed z-50 flex flex-col rounded-2xl border border-indigo-500/40 bg-[#060814]/95 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5',
            isExpanded
              ? 'bottom-4 right-4 left-4 top-4 sm:left-auto sm:top-auto sm:w-[600px] sm:h-[750px] sm:bottom-6 sm:right-6'
              : 'bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] sm:h-[580px] sm:bottom-6 sm:right-6 h-[85vh] max-h-[600px]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-950/80 bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-indigo-950/70 px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Bot className="h-4 w-4" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-[#060814]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">DevHub AI Copilot</h3>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Groq LPU
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Sub-second Latency</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullPage();
                  }}
                  title="Open as full workspace page"
                  className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-indigo-900/50 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors hidden sm:inline-block"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick suggestions banner */}
          <div className="bg-indigo-950/20 border-b border-indigo-950/40 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-indigo-400 shrink-0 flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Quick:</span>
            </span>
            {DEFAULT_SUGGESTIONS.slice(0, 3).map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/40 text-zinc-300 hover:text-white hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                {sug.slice(0, 26)}...
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-zinc-300 custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2.5 animate-in fade-in duration-200',
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5',
                      isUser
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold'
                        : 'bg-[#0f1430] border border-indigo-500/30 text-indigo-400'
                    )}
                  >
                    {isUser ? (
                      currentUser?.name?.charAt(0) || 'U'
                    ) : (
                      <Bot className="h-4 w-4 text-indigo-400" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn('max-w-[82%] space-y-1.5', isUser && 'items-end')}>
                    <div
                      className={cn(
                        'rounded-2xl p-3 shadow-md text-xs leading-relaxed',
                        isUser
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-xs'
                          : 'bg-[#0c1026] border border-indigo-950/80 text-zinc-200 rounded-tl-xs'
                      )}
                    >
                      {renderMessageContent(msg.content)}
                    </div>

                    {/* Quick suggested follow-ups from AI */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleSendMessage(action)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-800/30 text-indigo-300 hover:text-white hover:bg-indigo-800/40 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                            <span>{action}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className={cn(
                        'text-[9px] text-zinc-500 px-1',
                        isUser ? 'text-right' : 'text-left'
                      )}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-center animate-in fade-in">
                <div className="h-7 w-7 rounded-xl bg-[#0f1430] border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-xs bg-[#0c1026] border border-indigo-950/80 px-3.5 py-2.5 flex items-center gap-1.5 shadow-md">
                  <span className="text-[11px] text-indigo-300 font-medium mr-1">
                    DevHub AI thinking
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="border-t border-indigo-950/80 bg-[#070919] p-3 rounded-b-2xl">
            <div className="relative flex items-end gap-2 rounded-xl border border-indigo-900/60 bg-[#0a0d24] p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask DevHub AI anything... (Press Enter to send, Shift+Enter for newline)"
                rows={1}
                className="w-full resize-none bg-transparent px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none max-h-24 min-h-[28px]"
              />
              <Button
                size="sm"
                disabled={!inputMessage.trim() || isTyping}
                onClick={() => handleSendMessage()}
                className="h-8 w-8 rounded-lg p-0 shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between px-1 pt-1.5 text-[9px] text-zinc-500">
              <span>Powered by Groq Cloud LPU Acceleration</span>
              {onOpenStandupModal && (
                <button
                  onClick={onOpenStandupModal}
                  className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Open Standup Generator</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

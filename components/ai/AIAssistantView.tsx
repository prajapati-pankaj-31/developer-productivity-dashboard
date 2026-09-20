'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Task, Project } from '@/types';
import { ApiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Clock,
  ListTodo,
  MessageSquare,
  FileText,
  Map,
  Code2,
  Flame,
  Lightbulb,
  ShieldCheck,
  Database,
  Layers,
  Container,
  Terminal,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantViewProps {
  currentUser: User | null;
  tasks: Task[];
  projects?: Project[];
  weeklyFocusHours?: number;
  onNavigateToTasks?: () => void;
}

type AITab = 'chat' | 'standup' | 'roadmap' | 'task-generator';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

const QUICK_PROMPT_CATEGORIES = [
  {
    category: 'Architecture & Next.js',
    icon: Layers,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    prompts: [
      'How to structure Next.js 16 Server Components with optimistic UI?',
      'Best practices for JWT token refresh rotation in full-stack apps',
      'Design clean repository & service layers for TypeScript Express',
    ],
  },
  {
    category: 'PostgreSQL & Database',
    icon: Database,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    prompts: [
      'How to add composite indexes in PostgreSQL for fast task queries?',
      'Prisma connection pooling configuration under high concurrency',
      'Optimize complex aggregation queries for sprint analytics',
    ],
  },
  {
    category: 'DevOps & Cloud',
    icon: Container,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prompts: [
      'Create multi-stage Dockerfile for Next.js & Node.js backend',
      'Setup GitHub Actions CI pipeline with automated Vitest tests',
      'Configure healthchecks and graceful shutdown in production',
    ],
  },
  {
    category: 'Sprint & Velocity',
    icon: Flame,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    prompts: [
      'How can I break down large sprint stories into 4-hour tasks?',
      'Suggest strategies to eliminate WIP blockers before sprint review',
      'How to maintain deep focus blocks without meeting interruptions?',
    ],
  },
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentUser,
  tasks,
  projects = [],
  weeklyFocusHours = 6.5,
  onNavigateToTasks,
}) => {
  const [activeTab, setActiveTab] = useState<AITab>('chat');

  // --- CHAT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-lead',
      role: 'assistant',
      content: `### 👋 Welcome to DevHub AI Copilot, **${currentUser?.name || 'Developer'}**!\n\nI am your dedicated software engineering lead and sprint assistant powered by **Groq LPU Acceleration** (<400ms inference).\n\nI currently have full workspace context on **${tasks.length} sprint tasks** and **${projects.length || 4} projects**. You can ask me to debug code, design database schemas, plan sprint deliverables, or review architecture patterns!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How can I boost my sprint velocity this week?',
        'Show PostgreSQL composite index optimization tips',
        'Break down our Auth Gateway into technical subtasks',
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // --- STANDUP STATE ---
  const [isGeneratingStandup, setIsGeneratingStandup] = useState(false);
  const [isCopiedStandup, setIsCopiedStandup] = useState(false);
  const [standupData, setStandupData] = useState<{
    greeting: string;
    yesterday: string[];
    today: string[];
    blockers: string[];
    productivityScore: number;
    smartSuggestions: string[];
    formattedSlackText: string;
  } | null>(null);

  // --- ROADMAP STATE ---
  const [roadmapProjectName, setRoadmapProjectName] = useState('Developer Productivity Hub');
  const [roadmapConcept, setRoadmapConcept] = useState('Real-time agile workspace with AI sprint planning & velocity analytics');
  const [roadmapTechStack, setRoadmapTechStack] = useState('Next.js 16, TypeScript, Tailwind CSS, Express, PostgreSQL, Prisma');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any | null>(null);

  // --- TASK GENERATOR STATE ---
  const [taskPrompt, setTaskPrompt] = useState('');
  const [taskPriorityHint, setTaskPriorityHint] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [generatedTaskResult, setGeneratedTaskResult] = useState<any | null>(null);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollChatToBottom();
    }
  }, [activeTab, chatMessages, isChatTyping]);

  // --- SEND CHAT MESSAGE ---
  const handleSendChatMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query || isChatTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      const activeTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
      const historyPayload = [...chatMessages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiClient.chatWithAI({
        messages: historyPayload,
        context: {
          userName: currentUser?.name || 'Developer',
          userRole: currentUser?.role || 'Full Stack Engineer',
          activeTasksCount,
          projectsCount: projects.length || 4,
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

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI chat error:', err);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. What technical topic or sprint goal would you like to discuss, **${currentUser?.name || 'Developer'}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'How to optimize slow PostgreSQL queries?',
          'Help me structure Next.js 16 SSR components',
          'Generate daily standup report',
        ],
      },
    ]);
  };

  const handleGenerateStandup = async () => {
    setIsGeneratingStandup(true);
    try {
      const result = await ApiClient.generateAIStandup({
        userName: currentUser?.name || 'Developer',
        focusHours: weeklyFocusHours,
        tasks: tasks.map((t) => ({
          title: t.title,
          status: t.status,
          projectName: t.projectName,
          priority: t.priority,
        })),
      });
      setStandupData(result);
    } catch (err) {
      console.warn('AI standup error:', err);
    } finally {
      setIsGeneratingStandup(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!roadmapProjectName.trim()) return;
    setIsGeneratingRoadmap(true);
    try {
      const techList = roadmapTechStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await ApiClient.generateAIRoadmap(
        roadmapProjectName,
        roadmapConcept,
        techList.length > 0 ? techList : undefined
      );
      setRoadmapData(res);
    } catch (err) {
      console.warn('AI roadmap error:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleGenerateTask = async () => {
    if (!taskPrompt.trim()) return;
    setIsGeneratingTask(true);
    try {
      const res = await ApiClient.generateAITask(taskPrompt, 'DPD', taskPriorityHint);
      setGeneratedTaskResult(res);
    } catch (err) {
      console.warn('AI task generator error:', err);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'standup' && !standupData) {
      handleGenerateStandup();
    }
  }, [activeTab]);

  const handleCopySlack = () => {
    if (!standupData) return;
    navigator.clipboard.writeText(standupData.formattedSlackText);
    setIsCopiedStandup(true);
    setTimeout(() => setIsCopiedStandup(false), 2000);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const formatBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-100">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]">$1</code>');
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        const language = codeLines[0].trim();
        const actualCode = (language && !language.includes(' ') ? codeLines.slice(1) : codeLines).join('\n');
        const blockId = `page-code-${index}`;

        return (
          <div key={index} className="my-3 rounded-xl border border-indigo-900/60 bg-[#060814] overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-3.5 py-2 bg-indigo-950/40 border-b border-indigo-900/40 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>{language || 'code'}</span>
              </span>
              <button
                onClick={() => handleCopyCode(actualCode, blockId)}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeId === blockId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
              <code>{actualCode}</code>
            </pre>
          </div>
        );
      }

      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1" />;

            if (line.startsWith('### ')) {
              return (
                <h4 key={lIdx} className="text-sm font-bold text-indigo-300 mt-2 mb-1">
                  {line.replace('### ', '')}
                </h4>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h3 key={lIdx} className="text-base font-bold text-white mt-3 mb-1">
                  {line.replace('## ', '')}
                </h3>
              );
            }

            if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
              const bulletText = line.trim().replace(/^[-•*]\s*/, '');
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-indigo-950/60 p-6 shadow-[0_0_35px_rgba(99,102,241,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)]">
              <Bot className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">DevHub AI Copilot &amp; Assistant</h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Groq LPU Ultra-Fast</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                Real-time AI software engineering lead embedded directly in your workspace. Ask architecture questions, debug SQL queries, generate sprint tasks, and automate daily standups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-indigo-800/40 bg-[#0a0d24] px-3.5 py-2 text-right hidden sm:block">
              <div className="text-[10px] text-zinc-400 font-medium">Active Sprint Context</div>
              <div className="text-xs font-bold text-indigo-300">
                {tasks.length} Tasks • {weeklyFocusHours}h Logged
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-indigo-950/60 pt-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm',
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <MessageSquare className="h-4 w-4" />
            <span>💬 Live DevHub AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('standup')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm',
              activeTab === 'standup'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <FileText className="h-4 w-4" />
            <span>📋 Daily Standup &amp; Slack Report</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm',
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <Map className="h-4 w-4" />
            <span>🗺️ AI Roadmap &amp; Tech Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('task-generator')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm',
              activeTab === 'task-generator'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>⚡ AI Sprint Task Generator</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL LIVE CHAT EXPERIENCE */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Quick Prompt Library */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-indigo-950/70 bg-[#060814]/80 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-950/60 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span>Prompt Shortcuts</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">1-Click</span>
              </div>

              <div className="space-y-4">
                {QUICK_PROMPT_CATEGORIES.map((cat, idx) => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                        <CatIcon className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{cat.category}</span>
                      </div>
                      <div className="space-y-1">
                        {cat.prompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendChatMessage(p)}
                            className="w-full text-left text-[11px] p-2 rounded-lg bg-zinc-900/50 hover:bg-indigo-950/50 border border-zinc-800 hover:border-indigo-500/40 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer leading-snug"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Chat Interface */}
          <div className="lg:col-span-3 flex flex-col rounded-2xl border border-indigo-950/80 bg-[#060814]/90 shadow-2xl h-[700px]">
            {/* Chat Header Bar */}
            <div className="flex items-center justify-between border-b border-indigo-950/80 px-5 py-3.5 bg-gradient-to-r from-indigo-950/40 to-purple-950/30 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-white">DevHub AI Engineering Session</h3>
                  <p className="text-[10px] text-zinc-400">
                    Active Model: <code className="font-mono text-indigo-300">Groq Llama-3.3-70B / GPT-OSS-120B</code>
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="text-xs border-zinc-800 text-zinc-400 hover:text-zinc-100 h-7 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear Thread</span>
              </Button>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs custom-scrollbar">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3.5 animate-in fade-in duration-200',
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-md mt-0.5',
                        isUser
                          ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold'
                          : 'bg-[#0e1330] border border-indigo-500/40 text-indigo-400'
                      )}
                    >
                      {isUser ? currentUser?.name?.charAt(0) || 'U' : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={cn('max-w-[85%] space-y-2', isUser && 'items-end')}>
                      <div
                        className={cn(
                          'rounded-2xl p-4 shadow-lg text-xs leading-relaxed',
                          isUser
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-xs'
                            : 'bg-[#0a0d24] border border-indigo-950/80 text-zinc-200 rounded-tl-xs'
                        )}
                      >
                        {renderMessageContent(msg.content)}
                      </div>

                      {/* AI Suggested Actions */}
                      {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleSendChatMessage(action)}
                              className="text-[11px] px-3 py-1 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-indigo-300 hover:text-white hover:bg-indigo-800/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="h-3 w-3 text-indigo-400" />
                              <span>{action}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={cn('text-[10px] text-zinc-500 px-1', isUser ? 'text-right' : 'text-left')}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isChatTyping && (
                <div className="flex gap-3.5 items-center animate-in fade-in">
                  <div className="h-8 w-8 rounded-xl bg-[#0e1330] border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs bg-[#0a0d24] border border-indigo-950/80 px-4 py-3 flex items-center gap-2 shadow-md">
                    <span className="text-xs text-indigo-300 font-medium mr-1">
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

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar Area */}
            <div className="border-t border-indigo-950/80 bg-[#070919] p-4 rounded-b-2xl">
              <div className="relative flex items-end gap-2 rounded-xl border border-indigo-900/60 bg-[#0a0d24] p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  placeholder="Ask DevHub AI anything... (Press Enter to send, Shift+Enter for newline)"
                  rows={2}
                  className="w-full resize-none bg-transparent px-3 py-1 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none max-h-32 min-h-[40px]"
                />
                <Button
                  size="sm"
                  disabled={!chatInput.trim() || isChatTyping}
                  onClick={() => handleSendChatMessage()}
                  className="h-10 px-4 rounded-xl shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 font-semibold text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </Button>
              </div>
              <div className="flex items-center justify-between px-1 pt-2 text-[10px] text-zinc-500 font-mono">
                <span>Sub-second LPU Inference via Groq Cloud</span>
                <span>Press Enter ↵ to Send</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY STANDUP & SLACK REPORT */}
      {/* ========================================================================= */}
      {activeTab === 'standup' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0e1227] to-[#080a1a] p-5 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Daily Standup Synthesizer</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Synthesized from {tasks.length} active tickets &amp; {weeklyFocusHours}h deep focus logs.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={isGeneratingStandup}
              onClick={handleGenerateStandup}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingStandup ? 'animate-spin' : ''}`} />
              <span>{isGeneratingStandup ? 'Analyzing...' : 'Re-generate Standup'}</span>
            </Button>
          </div>

          {isGeneratingStandup && (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="h-10 w-10 rounded-full border-3 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              <p className="text-xs text-zinc-400 animate-pulse">
                Synthesizing completed deliverables, active tickets, and velocity score...
              </p>
            </div>
          )}

          {!isGeneratingStandup && standupData && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* KPI metrics bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">Velocity Score</div>
                    <div className="text-base font-bold text-emerald-400">{standupData.productivityScore}%</div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">Deep Work Today</div>
                    <div className="text-base font-bold text-indigo-300">{weeklyFocusHours} Hours</div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-3.5 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ListTodo className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400">In Progress</div>
                    <div className="text-base font-bold text-purple-300">
                      {tasks.filter((t) => t.status === 'in_progress').length} Active Tasks
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatted Standup Card */}
              <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-[#0e1227] to-[#080a1a] p-6 space-y-4 text-xs text-zinc-200 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <span className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>Daily Standup Report Draft</span>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopySlack}
                    className="flex items-center gap-1.5 text-xs text-zinc-200 hover:text-white border-zinc-700 py-1 h-8"
                  >
                    {isCopiedStandup ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isCopiedStandup ? 'Copied to Clipboard!' : 'Copy for Slack / Teams'}</span>
                  </Button>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>✅ What I Did Yesterday:</span>
                  </div>
                  <ul className="space-y-1.5 pl-4 text-zinc-300 text-xs">
                    {standupData.yesterday.map((item, idx) => (
                      <li key={idx} className="list-disc leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🎯 What I'm Doing Today:</span>
                  </div>
                  <ul className="space-y-1.5 pl-4 text-zinc-300 text-xs">
                    {standupData.today.map((item, idx) => (
                      <li key={idx} className="list-disc leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🛑 Blockers &amp; Risks:</span>
                  </div>
                  <ul className="space-y-1.5 pl-4 text-zinc-300 text-xs">
                    {standupData.blockers.map((item, idx) => (
                      <li key={idx} className="list-disc leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-xl border border-indigo-950/80 bg-indigo-950/30 p-4 space-y-2.5">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>AI Productivity Lead Recommendations</span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-300">
                  {standupData.smartSuggestions.map((sug, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AI ROADMAP & TECH STACK PLANNER */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-[#0a0d20] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">AI Software Roadmap &amp; Milestone Generator</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Project / Feature Name</label>
                <input
                  type="text"
                  value={roadmapProjectName}
                  onChange={(e) => setRoadmapProjectName(e.target.value)}
                  placeholder="e.g. Distributed Notification Engine"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-[#070919] px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Target Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={roadmapTechStack}
                  onChange={(e) => setRoadmapTechStack(e.target.value)}
                  placeholder="Next.js 16, TypeScript, Redis, PostgreSQL"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-[#070919] px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Concept &amp; Core Requirements</label>
                <textarea
                  value={roadmapConcept}
                  onChange={(e) => setRoadmapConcept(e.target.value)}
                  rows={2}
                  placeholder="Describe what the system solves, throughput, and target users..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-[#070919] px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <Button
              disabled={isGeneratingRoadmap || !roadmapProjectName.trim()}
              onClick={handleGenerateRoadmap}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingRoadmap ? 'animate-spin' : ''}`} />
              <span>{isGeneratingRoadmap ? 'Generating Milestones with Groq...' : 'Generate Architectural Roadmap'}</span>
            </Button>
          </div>

          {roadmapData && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-indigo-950/80 bg-[#0e1227] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-indigo-300">{roadmapData.projectName}</h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Roadmap Plan
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{roadmapData.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {roadmapData.suggestedTechStack?.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {roadmapData.milestones?.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-800/80 bg-[#0a0d20] p-4 text-xs space-y-2.5 shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                      <span className="font-bold text-sm text-zinc-100">
                        {m.phase}: {m.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono px-2 py-0.5 rounded bg-zinc-800">
                        {m.duration}
                      </span>
                    </div>
                    <ul className="space-y-1.5 pl-4 text-zinc-300">
                      {m.deliverables?.map((d: string, dIdx: number) => (
                        <li key={dIdx} className="list-disc leading-relaxed">{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AI SPRINT TASK GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'task-generator' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-[#0a0d20] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">AI Sprint Task &amp; Acceptance Criteria Generator</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400">Prompt / Feature Deliverable</label>
                <input
                  type="text"
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="e.g. Implement OAuth 2.0 Google login with session refresh rotation"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-[#070919] px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Suggested Priority</label>
                <div className="mt-1 flex gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setTaskPriorityHint(p)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer',
                        taskPriorityHint === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                disabled={isGeneratingTask || !taskPrompt.trim()}
                onClick={handleGenerateTask}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className={`h-4 w-4 ${isGeneratingTask ? 'animate-spin' : ''}`} />
                <span>{isGeneratingTask ? 'Generating Task with Subtasks...' : 'Generate Sprint Task with AI'}</span>
              </Button>
            </div>
          </div>

          {generatedTaskResult && (
            <div className="rounded-2xl border border-indigo-950/80 bg-[#0a0d20] p-6 space-y-4 text-xs animate-in fade-in duration-200 shadow-xl">
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-zinc-100">{generatedTaskResult.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                      Est: {generatedTaskResult.estimatedHours}h
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] capitalize">
                      Priority: {generatedTaskResult.suggestedPriority}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description &amp; Objectives:</h5>
                <p className="text-zinc-300 leading-relaxed bg-[#070919] p-3 rounded-xl border border-zinc-800 whitespace-pre-line">
                  {generatedTaskResult.description}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Generated Subtasks ({generatedTaskResult.subtasks?.length || 0}):</h5>
                <div className="space-y-2">
                  {generatedTaskResult.subtasks?.map((st: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-[#070919] flex items-center gap-2.5 text-zinc-200"
                    >
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span>{typeof st === 'string' ? st : st.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {generatedTaskResult.tags?.map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-mono text-zinc-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

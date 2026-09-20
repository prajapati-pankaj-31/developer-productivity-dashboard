'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Task } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ApiClient } from '@/lib/api-client';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Clock,
  ListTodo,
  MessageSquare,
  FileText,
  Map,
  Send,
  Trash2,
  Code2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISprintCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  tasks: Task[];
  weeklyFocusHours?: number;
}

type CopilotTab = 'chat' | 'standup' | 'roadmap';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

export const AISprintCopilotModal: React.FC<AISprintCopilotModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  tasks,
  weeklyFocusHours = 6.5,
}) => {
  const [activeTab, setActiveTab] = useState<CopilotTab>('chat');

  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Hello **${currentUser?.name || 'Developer'}**! 👋 I'm your **DevHub AI Copilot** powered by Groq LPU acceleration. I have context on your active sprint (${tasks.length} tasks). Ask me anything about architecture, debugging, database queries, or sprint planning!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How can I boost my sprint velocity?',
        'Help me plan Next.js & PostgreSQL architecture',
        'Suggest subtasks for upcoming sprint backlog',
      ],
    },
  ]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const [roadmapProjectName, setRoadmapProjectName] = useState('Developer Productivity Hub');
  const [roadmapConcept, setRoadmapConcept] = useState('Real-time agile workspace with AI sprint planning & velocity analytics');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any | null>(null);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollChatToBottom();
    }
  }, [isOpen, activeTab, chatMessages]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isChatTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      const activeTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
      const historyPayload = [...chatMessages, userMsg].map((m) => ({
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

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI Chat Error:', err);
    } finally {
      setIsChatTyping(false);
    }
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
      console.warn('AI Standup Error:', err);
    } finally {
      setIsGeneratingStandup(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await ApiClient.generateAIRoadmap(roadmapProjectName, roadmapConcept);
      setRoadmapData(res);
    } catch (err) {
      console.warn('AI Roadmap Error:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'standup' && !standupData) {
      handleGenerateStandup();
    }
  }, [isOpen, activeTab]);

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
        const blockId = `modal-code-${index}`;

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

      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1" />;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DevHub AI Engineering Copilot"
      description="Conversational AI Assistant, Automated Standup Reporting & Sprint Roadmap Generator."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800/80 bg-[#080a1c] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            )}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>💬 DevHub AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('standup')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'standup'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>📋 Daily Standup & Slack</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            )}
          >
            <Map className="h-3.5 w-3.5" />
            <span>🗺️ Roadmap Planner</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE AI CHATBOT */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-semibold text-indigo-400 shrink-0 flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-400" />
                <span>Suggested:</span>
              </span>
              {[
                '⚡ How to optimize PostgreSQL indexes?',
                '🛡️ Architect JWT Refresh Token Rotation',
                '🚀 Plan subtasks for Payment Gateway',
                '🐳 Next.js Docker deployment guide',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(chip)}
                  className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-zinc-300 hover:text-white hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Thread */}
            <div className="h-[360px] overflow-y-auto rounded-xl border border-indigo-950/80 bg-[#070919] p-3.5 space-y-3.5 text-xs custom-scrollbar">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-2.5 animate-in fade-in duration-200',
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5',
                        isUser
                          ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold'
                          : 'bg-[#0f1430] border border-indigo-500/30 text-indigo-400'
                      )}
                    >
                      {isUser ? currentUser?.name?.charAt(0) || 'U' : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={cn('max-w-[85%] space-y-1.5', isUser && 'items-end')}>
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

                      {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleSendChatMessage(action)}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-800/30 text-indigo-300 hover:text-white hover:bg-indigo-800/40 transition-colors flex items-center gap-1"
                            >
                              <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                              <span>{action}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className={cn('text-[9px] text-zinc-500 px-1', isUser ? 'text-right' : 'text-left')}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isChatTyping && (
                <div className="flex gap-2.5 items-center animate-in fade-in">
                  <div className="h-7 w-7 rounded-xl bg-[#0f1430] border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs bg-[#0c1026] border border-indigo-950/80 px-3.5 py-2 flex items-center gap-1.5 shadow-md">
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

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="relative flex items-center gap-2 rounded-xl border border-indigo-900/60 bg-[#0a0d24] p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Ask DevHub AI anything about your code, backlog, or architecture..."
                className="w-full bg-transparent px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <Button
                size="sm"
                disabled={!chatInput.trim() || isChatTyping}
                onClick={() => handleSendChatMessage()}
                className="h-8 px-3 rounded-lg shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-1 text-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: DAILY STANDUP & VELOCITY */}
        {activeTab === 'standup' && (
          <div className="space-y-4">
            {/* Header / Re-generate banner */}
            <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Daily Standup Synthesizer</div>
                  <div className="text-[11px] text-zinc-400">
                    Compiled from {tasks.length} active tasks & {weeklyFocusHours}h deep focus logs.
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={isGeneratingStandup}
                onClick={handleGenerateStandup}
                className="text-xs border-indigo-500/40"
              >
                <Sparkles className={`h-3.5 w-3.5 mr-1 text-indigo-400 ${isGeneratingStandup ? 'animate-spin' : ''}`} />
                <span>{isGeneratingStandup ? 'Analyzing...' : 'Regenerate'}</span>
              </Button>
            </div>

            {isGeneratingStandup && (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <p className="text-xs text-zinc-400 animate-pulse">Synthesizing sprint standup...</p>
              </div>
            )}

            {!isGeneratingStandup && standupData && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-2.5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">Velocity</div>
                      <div className="text-xs font-bold text-emerald-400">{standupData.productivityScore}%</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-2.5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">Focus Hours</div>
                      <div className="text-xs font-bold text-indigo-300">{weeklyFocusHours}h</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-2.5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                      <ListTodo className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">In Progress</div>
                      <div className="text-xs font-bold text-purple-300">
                        {tasks.filter((t) => t.status === 'in_progress').length} Tasks
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standup Details Card */}
                <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-[#0e1227] to-[#080a1a] p-4 space-y-3 text-xs text-zinc-200">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Standup Overview</span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopySlack}
                      className="text-[11px] border-zinc-700 py-1 h-7 flex items-center gap-1"
                    >
                      {isCopiedStandup ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopiedStandup ? 'Copied!' : 'Copy for Slack / Teams'}</span>
                    </Button>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      ✅ Yesterday:
                    </div>
                    <ul className="space-y-1 pl-3 text-zinc-300">
                      {standupData.yesterday.map((y, idx) => (
                        <li key={idx} className="list-disc leading-relaxed">{y}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      🎯 Today:
                    </div>
                    <ul className="space-y-1 pl-3 text-zinc-300">
                      {standupData.today.map((t, idx) => (
                        <li key={idx} className="list-disc leading-relaxed">{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      🛑 Blockers:
                    </div>
                    <ul className="space-y-1 pl-3 text-zinc-300">
                      {standupData.blockers.map((b, idx) => (
                        <li key={idx} className="list-disc leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROADMAP & TECH PLANNER */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-[#0a0d20] p-3.5 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Map className="h-4 w-4 text-purple-400" />
                <span>AI Software Roadmap & Milestone Generator</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400">Project Name</label>
                  <input
                    type="text"
                    value={roadmapProjectName}
                    onChange={(e) => setRoadmapProjectName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#070919] px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400">Concept / Goal</label>
                  <input
                    type="text"
                    value={roadmapConcept}
                    onChange={(e) => setRoadmapConcept(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#070919] px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <Button
                size="sm"
                disabled={isGeneratingRoadmap || !roadmapProjectName.trim()}
                onClick={handleGenerateRoadmap}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isGeneratingRoadmap ? 'animate-spin' : ''}`} />
                <span>{isGeneratingRoadmap ? 'Generating Milestones...' : 'Generate Roadmap with AI'}</span>
              </Button>
            </div>

            {roadmapData && (
              <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                <div className="rounded-xl border border-indigo-950/80 bg-[#0e1227] p-3 text-xs space-y-2">
                  <div className="font-bold text-indigo-300">{roadmapData.projectName}</div>
                  <p className="text-zinc-300 leading-relaxed">{roadmapData.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {roadmapData.suggestedTechStack?.map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-[10px] text-indigo-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {roadmapData.milestones?.map((m: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-zinc-800/80 bg-[#0a0d20] p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100">{m.phase}: {m.title}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{m.duration}</span>
                      </div>
                      <ul className="space-y-1 pl-3 text-zinc-300">
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

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500">
          <span>Groq LPU Acceleration • llama-3.3-70b / gpt-oss-120b</span>
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

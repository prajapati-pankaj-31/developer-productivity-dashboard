'use client';

import React, { useState } from 'react';
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
  AlertCircle,
  Clock,
  ArrowRight,
  ListTodo,
} from 'lucide-react';

interface AISprintCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  tasks: Task[];
  weeklyFocusHours?: number;
}

export const AISprintCopilotModal: React.FC<AISprintCopilotModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  tasks,
  weeklyFocusHours = 6.5,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [standupData, setStandupData] = useState<{
    greeting: string;
    yesterday: string[];
    today: string[];
    blockers: string[];
    productivityScore: number;
    smartSuggestions: string[];
    formattedSlackText: string;
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
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
      console.warn('AI standup generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !standupData) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleCopySlack = () => {
    if (!standupData) return;
    navigator.clipboard.writeText(standupData.formattedSlackText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Sprint Copilot & Standup Assistant"
      description="Automated daily standup reporting, sprint velocity insights, and AI recommendations."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 p-4 shadow-[0_0_25px_rgba(99,102,241,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sprint Intelligence Engine</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    GPT-4 / Gemini Core
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Analyzed {tasks.length} sprint deliverables and {weeklyFocusHours}h deep focus logs.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="text-xs shrink-0 flex items-center gap-1.5 border-indigo-500/40 hover:bg-indigo-500/10"
            >
              <Sparkles className={`h-3.5 w-3.5 text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing...' : 'Regenerate'}</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            <p className="text-xs text-zinc-400 animate-pulse">
              Synthesizing completed PRs, active tickets, and velocity score...
            </p>
          </div>
        )}

        {/* Generated Content */}
        {!isGenerating && standupData && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* KPI pill bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-[#0a0d20]/80 p-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Productivity Velocity</div>
                  <div className="text-sm font-bold text-emerald-400">{standupData.productivityScore}%</div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#0a0d20]/80 p-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Deep Work Today</div>
                  <div className="text-sm font-bold text-indigo-300">{weeklyFocusHours} Hours</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-800 bg-[#0a0d20]/80 p-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ListTodo className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Active Tasks</div>
                  <div className="text-sm font-bold text-purple-300">
                    {tasks.filter((t) => t.status === 'in_progress').length} In Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Standup Card */}
            <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-[#0e1227] to-[#080a1a] p-4 space-y-3.5 text-xs text-zinc-200 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Daily Standup Report</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopySlack}
                  className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white border-zinc-700 py-1 h-7"
                >
                  {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{isCopied ? 'Copied to Clipboard!' : 'Copy for Slack / Teams'}</span>
                </Button>
              </div>

              {/* Yesterday */}
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>✅ What I Did Yesterday:</span>
                </div>
                <ul className="space-y-1 pl-3 text-zinc-300">
                  {standupData.yesterday.map((item, idx) => (
                    <li key={idx} className="list-disc list-outside leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Today */}
              <div>
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>🎯 What I'm Doing Today:</span>
                </div>
                <ul className="space-y-1 pl-3 text-zinc-300">
                  {standupData.today.map((item, idx) => (
                    <li key={idx} className="list-disc list-outside leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blockers */}
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>🛑 Blockers & Risks:</span>
                </div>
                <ul className="space-y-1 pl-3 text-zinc-300">
                  {standupData.blockers.map((item, idx) => (
                    <li key={idx} className="list-disc list-outside leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="rounded-xl border border-indigo-950/70 bg-indigo-950/20 p-3.5 space-y-2">
              <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>AI Productivity Copilot Recommendations</span>
              </div>
              <div className="space-y-1.5">
                {standupData.smartSuggestions.map((sug, i) => (
                  <div key={i} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-zinc-800/80">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

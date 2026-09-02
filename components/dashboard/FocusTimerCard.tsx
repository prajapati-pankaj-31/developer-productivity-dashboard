'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const WORK_SECONDS = 25 * 60; // 25 min
const BREAK_SECONDS = 5 * 60; // 5 min

export const FocusTimerCard: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(3);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === 'work') {
            setSessionsCompleted((s) => s + 1);
            setMode('break');
            return BREAK_SECONDS;
          } else {
            setMode('work');
            return WORK_SECONDS;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalModeSeconds = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const progressPercent = Math.round(((totalModeSeconds - timeLeft) / totalModeSeconds) * 100);

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-indigo-950/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Deep Work Timer</h3>
            <p className="text-[11px] text-zinc-400">Flow session companion</p>
          </div>
        </div>
        <Badge variant={isRunning ? 'success' : 'zinc'} dot={isRunning} size="sm">
          {isRunning ? 'In Flow' : 'Paused'}
        </Badge>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-center gap-2 my-4">
        <button
          onClick={() => switchMode('work')}
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
            mode === 'work'
              ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          )}
        >
          25m Focus Sprint
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
            mode === 'break'
              ? 'bg-emerald-600 text-white dark:bg-emerald-500 shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          )}
        >
          5m Rest Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatTime(timeLeft)}
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {mode === 'work' ? 'Mute notifications & minimize tabs' : 'Stretch, hydrate, rest eyes'}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-[200px] h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              mode === 'work' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-emerald-500'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-100 dark:border-indigo-950/50">
        <Button
          variant={isRunning ? 'secondary' : 'primary'}
          size="sm"
          onClick={toggleTimer}
          className="min-w-[90px]"
        >
          {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={resetTimer} title="Reset Timer">
          <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
        </Button>
      </div>

      {/* Footer Streak */}
      <div className="mt-3 flex items-center justify-between text-[11px] bg-zinc-100/80 dark:bg-[#070918]/80 border border-zinc-200/80 dark:border-indigo-950/50 p-2.5 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-colors">
        <span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Today&apos;s Sessions
        </span>
        <span className="font-bold text-zinc-950 dark:text-white">
          {sessionsCompleted} sprints ({sessionsCompleted * 25}m)
        </span>
      </div>
    </div>
  );
};

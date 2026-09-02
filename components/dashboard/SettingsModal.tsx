'use client';

import React, { useState } from 'react';
import { TabType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import {
  Sliders,
  Timer,
  Bell,
  Eye,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkspaceSettings {
  workspaceName: string;
  defaultTab: TabType;
  pomodoroWorkDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  telemetryEnabled: boolean;
  soundAlertsEnabled: boolean;
  pushNotifications: boolean;
  particleDensity: 'vibrant' | 'balanced' | 'minimal';
  gridPatternVisible: boolean;
  spotlightEnabled: boolean;
}

export const defaultSettings: WorkspaceSettings = {
  workspaceName: "Pankaj's DevHub",
  defaultTab: 'overview',
  pomodoroWorkDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  telemetryEnabled: true,
  soundAlertsEnabled: true,
  pushNotifications: true,
  particleDensity: 'vibrant',
  gridPatternVisible: true,
  spotlightEnabled: true,
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkspaceSettings;
  onSaveSettings: (newSettings: WorkspaceSettings) => void;
}

const SettingsForm: React.FC<{
  settings: WorkspaceSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: WorkspaceSettings) => void;
}> = ({ settings, onClose, onSaveSettings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'focus' | 'notifications' | 'appearance'>('general');
  const [formData, setFormData] = useState<WorkspaceSettings>(settings || defaultSettings);
  const [isSaved, setIsSaved] = useState(false);

  const defaultTabOptions: SelectOption<TabType>[] = [
    { value: 'overview', label: '📊 Overview Dashboard' },
    { value: 'projects', label: '📁 Engineering Projects' },
    { value: 'tasks', label: '✅ Tasks & Sprints' },
    { value: 'activity', label: '📡 Engineering Telemetry' },
  ];

  const particleOptions: SelectOption<'vibrant' | 'balanced' | 'minimal'>[] = [
    { value: 'vibrant', label: '✨ Vibrant (Full Constellation & Glow)' },
    { value: 'balanced', label: '🌌 Balanced (Standard Particles)' },
    { value: 'minimal', label: '🌑 Minimal (Calm Ambience)' },
  ];

  const handleReset = () => {
    setFormData(defaultSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060814]/90 border border-indigo-950/70 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
            activeSubTab === 'general'
              ? 'bg-indigo-600 text-white shadow-xs border border-indigo-500/40'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          )}
        >
          <Sliders className="h-3.5 w-3.5" /> General
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('focus')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
            activeSubTab === 'focus'
              ? 'bg-indigo-600 text-white shadow-xs border border-indigo-500/40'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          )}
        >
          <Timer className="h-3.5 w-3.5" /> Focus &amp; Timer
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('notifications')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
            activeSubTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-xs border border-indigo-500/40'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          )}
        >
          <Bell className="h-3.5 w-3.5" /> Telemetry &amp; Alerts
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('appearance')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
            activeSubTab === 'appearance'
              ? 'bg-indigo-600 text-white shadow-xs border border-indigo-500/40'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          )}
        >
          <Eye className="h-3.5 w-3.5" /> Appearance &amp; FX
        </button>
      </div>

      {/* Tab 1: General Settings */}
      {activeSubTab === 'general' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Workspace Display Name
            </label>
            <input
              type="text"
              value={formData.workspaceName}
              onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
              required
              className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Shown on top of the sidebar and in your dashboard title.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Default Landing Tab
            </label>
            <Select
              value={formData.defaultTab}
              onChange={(val) => setFormData({ ...formData, defaultTab: val })}
              options={defaultTabOptions}
              size="md"
              className="w-full"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200">
                  Auto-Save &amp; Local Persistence
                </span>
                <p className="text-[11px] text-zinc-400">
                  Automatically persist filter parameters and active tasks locally.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Focus & Timer */}
      {activeSubTab === 'focus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Focus Session (min)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.pomodoroWorkDuration}
                onChange={(e) =>
                  setFormData({ ...formData, pomodoroWorkDuration: Number(e.target.value) || 25 })
                }
                className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Short Break (min)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.shortBreakDuration}
                onChange={(e) =>
                  setFormData({ ...formData, shortBreakDuration: Number(e.target.value) || 5 })
                }
                className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Long Break (min)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={formData.longBreakDuration}
                onChange={(e) =>
                  setFormData({ ...formData, longBreakDuration: Number(e.target.value) || 15 })
                }
                className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Auto-Start Breaks</span>
              <p className="text-[11px] text-zinc-400">
                Automatically transition to break timer upon focus session completion.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoStartBreaks}
              onChange={(e) => setFormData({ ...formData, autoStartBreaks: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>
        </div>
      )}

      {/* Tab 3: Notifications & Telemetry */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Real-Time Telemetry Simulation</span>
              <p className="text-[11px] text-zinc-400">
                Generate periodic engineering telemetry, PR merge events, and metrics stream.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.telemetryEnabled}
              onChange={(e) => setFormData({ ...formData, telemetryEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Audio Chimes &amp; Alerts</span>
              <p className="text-[11px] text-zinc-400">
                Play subtle soft audio chimes when pomodoro focus sessions finish.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.soundAlertsEnabled}
              onChange={(e) => setFormData({ ...formData, soundAlertsEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">PR Review &amp; CI/CD Alerts</span>
              <p className="text-[11px] text-zinc-400">
                Show notification bell badge on high-priority build and deployment updates.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.pushNotifications}
              onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>
        </div>
      )}

      {/* Tab 4: Appearance & FX */}
      {activeSubTab === 'appearance' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Futuristic Background Particle Density
            </label>
            <Select
              value={formData.particleDensity}
              onChange={(val) => setFormData({ ...formData, particleDensity: val })}
              options={particleOptions}
              size="md"
              className="w-full"
            />
          </div>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Developer Coordinate Grid</span>
              <p className="text-[11px] text-zinc-400">
                Render subtle geometric coordinate grid lines across background.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.gridPatternVisible}
              onChange={(e) => setFormData({ ...formData, gridPatternVisible: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Interactive Mouse Spotlight</span>
              <p className="text-[11px] text-zinc-400">
                Soft glowing ambient light follows pointer movement on desktop.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.spotlightEnabled}
              onChange={(e) => setFormData({ ...formData, spotlightEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-indigo-900 bg-[#0a0d20] text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
            />
          </label>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-indigo-950/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
          </button>
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in ml-2">
              <CheckCircle2 className="h-4 w-4" /> Preferences saved!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Preferences
          </Button>
        </div>
      </div>
    </form>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Workspace & Developer Preferences"
      description="Configure your development environment, timer intervals, telemetry, and background visuals."
      maxWidth="xl"
    >
      {isOpen && <SettingsForm settings={settings} onClose={onClose} onSaveSettings={onSaveSettings} />}
    </Modal>
  );
};

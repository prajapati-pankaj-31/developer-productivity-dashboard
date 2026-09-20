'use client';

import React, { useState } from 'react';
import { User, Task, DailyProductivity } from '@/types';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Select, SelectOption } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Clock,
  GitBranch,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Code2,
  Save,
  RotateCcw,
  ExternalLink,
  Target,
  Flame,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileViewProps {
  user: User;
  tasks?: Task[];
  weeklyData?: DailyProductivity[];
  onSaveUser: (updatedUser: Partial<User>) => void;
  onNavigateToTasks?: () => void;
}

const statusOptions: SelectOption<User['status']>[] = [
  { value: 'flow', label: '🟢 Flow State (Deep Focus)' },
  { value: 'available', label: '🔵 Available for Pairing' },
  { value: 'in_review', label: '🟣 Reviewing Pull Requests' },
  { value: 'away', label: '⚪ Away / In Meeting' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  tasks = [],
  weeklyData = [],
  onSaveUser,
  onNavigateToTasks,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<User['status']>(user.status);
  const [bio, setBio] = useState(
    'Full-stack developer & AI engineer building high-performance developer tools, SaaS architecture, and intelligent workflow automation.'
  );
  const [github, setGithub] = useState('prajapati-pankaj-31');
  const [weeklyFocusGoal, setWeeklyFocusGoal] = useState(
    user.weeklyFocusGoalHours?.toString() || '35'
  );
  const [skills, setSkills] = useState([
    'Next.js 16',
    'TypeScript',
    'React 19',
    'Tailwind CSS',
    'Python',
    'Docker',
    'PostgreSQL',
    'FastAPI',
    'Prometheus',
    'Prisma ORM',
    'Groq Cloud LPU',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Compute live user stats
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
  const totalHoursLogged = weeklyData.reduce((acc, curr) => acc + (curr.focusHours || 0), 0);
  const weeklyGoalNum = Number(weeklyFocusGoal) || 35;
  const progressPercent = Math.min(Math.round((totalHoursLogged / weeklyGoalNum) * 100), 100);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleReset = () => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setWeeklyFocusGoal(user.weeklyFocusGoalHours?.toString() || '35');
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      name,
      email,
      role,
      status,
      weeklyFocusGoalHours: Number(weeklyFocusGoal) || 35,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12 max-w-5xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-indigo-950/60 p-6 shadow-[0_0_35px_rgba(99,102,241,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar user={{ ...user, name }} size="xl" showStatus />
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-md border border-white/20">
                PRO
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{name || 'Developer Name'}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  AI &amp; Full Stack
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{status === 'flow' ? 'Flow State (Deep Focus)' : status === 'in_review' ? 'Reviewing PRs' : status === 'away' ? 'Away' : 'Available'}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{role || 'Full Stack Engineer'}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  {email}
                </span>
                <a
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                  github.com/{github}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="rounded-xl border border-indigo-800/40 bg-[#0a0d24] px-4 py-3 text-right hidden sm:block">
            <div className="text-[10px] text-zinc-400 font-medium">Sprint Focus Target</div>
            <div className="text-sm font-bold text-emerald-400">
              {totalHoursLogged.toFixed(1)}h / {weeklyGoalNum}h ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-950/60">
          <div className="p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-medium">Sprint Cycle</div>
              <div className="text-sm sm:text-base font-bold text-white">Sprint 14 (38 SP)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-medium">Focus Rate</div>
              <div className="text-sm sm:text-base font-bold text-emerald-400">
                {progressPercent}% ({totalHoursLogged.toFixed(1)}h)
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-medium">Completed Tasks</div>
              <div className="text-sm sm:text-base font-bold text-cyan-300">
                {completedTasksCount} / {tasks.length || 12} Tasks
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060814]/80 border border-indigo-950/70 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-medium">Sprint Velocity</div>
              <div className="text-sm sm:text-base font-bold text-indigo-300">+12% Velocity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Edit Form Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#060814]/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-400" />
              <span>Developer Identity &amp; Workspace Configuration</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Update personal info, skills, weekly focus target, and developer status.
            </p>
          </div>
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full animate-in fade-in">
              <Check className="h-3.5 w-3.5" /> Changes saved to workspace!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-indigo-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" /> Developer Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Active Developer Status
              </label>
              <Select
                value={status}
                onChange={(val) => setStatus(val)}
                options={statusOptions}
                size="md"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" /> Weekly Focus Target (Hours)
                </span>
                <span className="text-[11px] font-mono text-emerald-400">{weeklyFocusGoal} Hours/week</span>
              </label>
              <input
                type="number"
                min="5"
                max="80"
                value={weeklyFocusGoal}
                onChange={(e) => setWeeklyFocusGoal(e.target.value)}
                className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
              />
              <div className="mt-2 space-y-1">
                <ProgressBar value={progressPercent} size="xs" variant="gradient" />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Logged: {totalHoursLogged.toFixed(1)}h</span>
                  <span>Goal: {weeklyGoalNum}h</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-purple-400" /> GitHub Username
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
              />
            </div>
          </div>

          {/* Bio / Summary */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Developer Headline &amp; Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-[#0a0d24] border border-indigo-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          {/* Tech Stack & Skills Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-indigo-400" /> Skills &amp; Tech Stack
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Press Enter ↵ to add</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#0a0d24] border border-indigo-950/80 min-h-[48px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-xs"
                >
                  #{skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer text-sm font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Add skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 min-w-[120px] bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none px-2"
              />
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleReset}
              className="text-xs border-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Fields</span>
            </Button>

            <div className="flex items-center gap-3">
              {onNavigateToTasks && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={onNavigateToTasks}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <span>View Sprint Tasks</span>
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:opacity-95 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

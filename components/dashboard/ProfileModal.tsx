'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Select, SelectOption } from '@/components/ui/Select';
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
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSaveUser: (updatedUser: Partial<User>) => void;
}

const statusOptions: SelectOption<User['status']>[] = [
  { value: 'flow', label: '🟢 Flow State (Deep Focus)' },
  { value: 'available', label: '🔵 Available for Pairing' },
  { value: 'in_review', label: '🟣 Reviewing Pull Requests' },
  { value: 'away', label: '⚪ Away / In Meeting' },
];

const ProfileForm: React.FC<{
  user: User;
  onClose: () => void;
  onSaveUser: (updatedUser: Partial<User>) => void;
}> = ({ user, onClose, onSaveUser }) => {
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
    'React',
    'Tailwind CSS',
    'Python',
    'Docker',
    'PostgreSQL',
    'FastAPI',
    'Prometheus',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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
      onClose();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Card Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-950/80 bg-gradient-to-r from-[#0e1227] via-[#090d22] to-[#070918] p-4 sm:p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <Avatar user={{ ...user, name }} size="lg" showStatus />
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold shadow">
              PRO
            </span>
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {name || 'Developer Name'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                AI &amp; Dev
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">{role}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-indigo-400" />
                {email}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-purple-400" />
                github.com/{github}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-indigo-950/60 text-center">
          <div className="p-2 rounded-lg bg-[#060814]/70 border border-indigo-950/50">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> Sprint 14
            </span>
            <p className="text-sm font-bold text-white mt-0.5">38 SP</p>
          </div>
          <div className="p-2 rounded-lg bg-[#060814]/70 border border-indigo-950/50">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-indigo-400" /> Focus Rate
            </span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">90% (31.5h)</p>
          </div>
          <div className="p-2 rounded-lg bg-[#060814]/70 border border-indigo-950/50">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-cyan-400" /> Completed
            </span>
            <p className="text-sm font-bold text-white mt-0.5">9 Tasks</p>
          </div>
          <div className="p-2 rounded-lg bg-[#060814]/70 border border-indigo-950/50">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-400" /> Velocity
            </span>
            <p className="text-sm font-bold text-indigo-300 mt-0.5">+12%</p>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5 text-indigo-400" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
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
            className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
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
            className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
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
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-400" /> Weekly Focus Target (Hours)
          </label>
          <input
            type="number"
            min="5"
            max="80"
            value={weeklyFocusGoal}
            onChange={(e) => setWeeklyFocusGoal(e.target.value)}
            className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-purple-400" /> GitHub Username
          </label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
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
          rows={2}
          className="w-full rounded-lg bg-[#0a0d20] border border-indigo-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Tech Stack & Skills Tags */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-indigo-400" /> Skills &amp; Tech Stack
          </span>
          <span className="text-[11px] text-zinc-500 font-normal">Press Enter to add</span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2 p-2.5 rounded-lg bg-[#0a0d20] border border-indigo-950/80 min-h-[42px]">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/60"
            >
              #{skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
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
            className="flex-1 min-w-[90px] bg-transparent text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none px-1"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-indigo-950/60">
        <div>
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Profile Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Developer Profile & Identity"
      description="Manage your developer persona, active focus mode, weekly goals, and skills."
      maxWidth="xl"
    >
      {isOpen && <ProfileForm key={user.id} user={user} onClose={onClose} onSaveUser={onSaveUser} />}
    </Modal>
  );
};

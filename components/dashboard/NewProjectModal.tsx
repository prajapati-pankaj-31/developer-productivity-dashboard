'use client';

import React, { useState } from 'react';
import { Project, ProjectStatus, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { FolderPlus, Tag, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: User[];
  currentUserId?: string;
  onCreateProject: (project: Project) => void;
}

const statusOptions: SelectOption<ProjectStatus>[] = [
  { value: 'on_track', label: '🟢 On Track' },
  { value: 'at_risk', label: '🟡 At Risk' },
  { value: 'delayed', label: '🔴 Delayed' },
  { value: 'completed', label: '🔵 Completed' },
];

const presetColors = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#f43f5e', // Rose
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  currentUserId,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('on_track');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [repository, setRepository] = useState('https://github.com/prajapati-pankaj-31/');
  const [techStackInput, setTechStackInput] = useState('TypeScript, Next.js, PostgreSQL');
  const [leadId, setLeadId] = useState(currentUserId || teamMembers[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);
  const [error, setError] = useState('');
  const [isAIRoadmapLoading, setIsAIRoadmapLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (currentUserId && teamMembers.some((m) => m.id === currentUserId)) {
        setLeadId(currentUserId);
      } else if (teamMembers[0]?.id) {
        setLeadId(teamMembers[0].id);
      }
    }
  }, [isOpen, currentUserId, teamMembers]);

  const handleAIGenerateRoadmap = async () => {
    if (!name.trim()) {
      setError('Please enter a Project Name first to generate AI roadmap');
      return;
    }

    setIsAIRoadmapLoading(true);
    setError('');
    try {
      const result = await ApiClient.generateAIRoadmap(name.trim(), description.trim() || name.trim());
      setDescription(result.description);
      if (result.suggestedTechStack && result.suggestedTechStack.length > 0) {
        setTechStackInput(result.suggestedTechStack.join(', '));
      }
    } catch (err: any) {
      setError(err?.message || 'AI Roadmap generator error');
    } finally {
      setIsAIRoadmapLoading(false);
    }
  };

  const leadOptions: SelectOption[] = teamMembers.map((m) => {
    const isMe = currentUserId && m.id === currentUserId;
    return {
      value: m.id,
      label: isMe ? `⭐ You (${m.name} - ${m.role})` : `${m.name} (${m.role})`,
    };
  });

  const handleNameChange = (val: string) => {
    setName(val);
    if (error) setError('');
    // Auto-generate project key from name if not manually edited
    if (!key || key.length <= 4) {
      const generatedKey = val
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 4);
      if (generatedKey) {
        setKey(generatedKey);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!key.trim() || key.trim().length < 2 || key.trim().length > 6) {
      setError('Project key must be 2 to 6 uppercase letters (e.g. AUTH, CORE, SRV)');
      return;
    }
    if (!description.trim()) {
      setError('Project description is required');
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (techStack.length === 0) {
      setError('Please provide at least one tech stack tag (e.g. React, Node)');
      return;
    }

    const selectedLead = teamMembers.find((m) => m.id === leadId) || teamMembers[0];

    const newProject: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      status,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      repository: repository.trim() || `https://github.com/prajapati-pankaj-31/${key.toLowerCase()}`,
      techStack,
      lead: selectedLead,
      members: [selectedLead],
      color: selectedColor,
    };

    onCreateProject(newProject);
    setName('');
    setKey('');
    setDescription('');
    setTechStackInput('TypeScript, Next.js, PostgreSQL');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Engineering Project"
      description="Initialize a new codebase repository, milestone roadmap, and sprint team."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Name & Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Realtime Analytics Pipeline"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project Key <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={key}
              onChange={(e) => {
                setKey(e.target.value.toUpperCase());
                if (error) setError('');
              }}
              placeholder="RAP"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase placeholder-zinc-400 focus:border-indigo-500 focus:outline-none text-center"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description & Roadmap <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              disabled={isAIRoadmapLoading || !name.trim()}
              onClick={handleAIGenerateRoadmap}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              {isAIRoadmapLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 text-indigo-400" />
              )}
              <span>{isAIRoadmapLoading ? 'Synthesizing Roadmap...' : '✨ AI Suggest Roadmap & Stack'}</span>
            </button>
          </div>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError('');
            }}
            placeholder="High performance event streaming, aggregator microservices, and telemetry dashboard..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Project Lead & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project Lead / Owner
            </label>
            <Select
              value={leadId}
              onChange={(val) => setLeadId(val)}
              options={leadOptions}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Initial Status
            </label>
            <Select
              value={status}
              onChange={(val) => setStatus(val as ProjectStatus)}
              options={statusOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Deadline & Repository URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Milestone Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Repository URL
            </label>
            <input
              type="url"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              placeholder="https://github.com/org/repo"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Tech Stack Chips Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Tech Stack (comma-separated)
          </label>
          <div className="relative">
            <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Go, Kafka, Redis, Docker, gRPC"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Theme Accent Color Picker */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Project Theme Color
          </label>
          <div className="flex items-center gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-6 w-6 rounded-full transition-transform cursor-pointer ${
                  selectedColor === color
                    ? 'ring-2 ring-white scale-110 shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" className="flex items-center gap-1.5">
            <FolderPlus className="h-4 w-4" />
            <span>Create Project</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

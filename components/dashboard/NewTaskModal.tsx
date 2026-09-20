'use client';

import React, { useState } from 'react';
import { Project, Task, TaskPriority, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { ApiClient } from '@/lib/api-client';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  teamMembers: User[];
  currentUserId?: string;
  onAddTask: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  teamMembers,
  currentUserId,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [tagsInput, setTagsInput] = useState('');
  const [assigneeId, setAssigneeId] = useState(currentUserId || teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-10');
  const [error, setError] = useState('');
  const [generatedSubtasks, setGeneratedSubtasks] = useState<Array<{ title: string; completed: boolean }>>([
    { title: 'Initial setup and requirements review', completed: false },
    { title: 'Core implementation & tests', completed: false },
  ]);

  // AI prompt generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (currentUserId && teamMembers.some((m) => m.id === currentUserId)) {
        setAssigneeId(currentUserId);
      } else if (teamMembers[0]?.id) {
        setAssigneeId(teamMembers[0].id);
      }
    }
  }, [isOpen, currentUserId, teamMembers]);

  const handleAIGenerate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsAILoading(true);
    setError('');
    try {
      const selectedProj = projects.find((p) => p.id === projectId);
      const aiResult = await ApiClient.generateAITask(promptToUse.trim(), selectedProj?.key);
      setTitle(aiResult.title);
      setDescription(aiResult.description);
      setPriority(aiResult.suggestedPriority);
      setEstimatedHours(String(aiResult.estimatedHours));
      setTagsInput(aiResult.tags.join(', '));
      if (aiResult.subtasks && aiResult.subtasks.length > 0) {
        setGeneratedSubtasks(aiResult.subtasks);
      }
      setAiPrompt('');
    } catch (err: any) {
      setError(err?.message || 'AI generation encountered an issue');
    } finally {
      setIsAILoading(false);
    }
  };

  const projectOptions: SelectOption[] = projects.map((p) => ({
    value: p.id,
    label: `${p.key} - ${p.name}`,
  }));

  const priorityOptions: SelectOption<TaskPriority>[] = [
    { value: 'urgent', label: '🔴 Urgent' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🔵 Medium' },
    { value: 'low', label: '⚪ Low' },
  ];

  const assigneeOptions: SelectOption[] = teamMembers.map((m) => {
    const isMe = currentUserId && m.id === currentUserId;
    return {
      value: m.id,
      label: isMe ? `⭐ You (${m.name} - ${m.role})` : `${m.name} (${m.role})`,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const selectedProject = projects.find((p) => p.id === projectId) || projects[0];
    const selectedAssignee = teamMembers.find((m) => m.id === assigneeId) || teamMembers[0];

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const subtasks = generatedSubtasks.map((st, i) => ({
      id: `sub-${Date.now()}-${i + 1}`,
      title: st.title,
      completed: st.completed,
    }));

    const newTask: Task = {
      id: `task-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim() || 'No additional description provided.',
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      priority,
      status: 'in_progress',
      assignee: selectedAssignee,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: parseFloat(estimatedHours) || 4,
      loggedHours: 0,
      subtasks,
      tags: tags.length > 0 ? tags : ['Engineering', 'Feature'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setTagsInput('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sprint Task"
      description="Add a task to your active sprint backlog or work in progress."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* AI Prompt Auto-Fill Section (TASK 4) */}
        <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 p-3 shadow-[0_0_15px_rgba(99,102,241,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>✨ AI Smart Task & Subtask Generator</span>
            </span>
            <span className="text-[10px] text-zinc-400">Type idea & click Generate</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAIGenerate();
                }
              }}
              placeholder="e.g. Stripe checkout payment gateway with webhook verification"
              className="flex-1 rounded-lg border border-indigo-900/60 bg-[#070a1a] px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
            <Button
              type="button"
              size="sm"
              disabled={isAILoading || !aiPrompt.trim()}
              onClick={() => handleAIGenerate()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 shrink-0 px-3 py-1 h-8"
            >
              {isAILoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3 text-indigo-200" />
              )}
              <span>{isAILoading ? 'Generating...' : 'Auto-Fill'}</span>
            </Button>
          </div>

          {/* Quick AI Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] text-zinc-400">Quick suggestions:</span>
            {['Redis Rate Limiter', 'Docker K8s Deployment', 'OAuth 2.0 Google Login'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setAiPrompt(chip);
                  handleAIGenerate(chip);
                }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-indigo-500/20 text-zinc-300 hover:text-indigo-200 border border-white/[0.08] transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Implement edge rate limiting on Auth Gateway"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Project & Priority row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Assigned Project
            </label>
            <Select
              value={projectId}
              onChange={(val) => setProjectId(val)}
              options={projectOptions}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Priority Level
            </label>
            <Select
              value={priority}
              onChange={(val) => setPriority(val as TaskPriority)}
              options={priorityOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Assignee
            </label>
            <Select
              value={assigneeId}
              onChange={(val) => setAssigneeId(val)}
              options={assigneeOptions}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Due Date & Est. Hours
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-2/3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="Hrs"
                className="w-1/3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none text-center"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Task Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context, acceptance criteria, or technical references..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Security, Redis, API, Performance"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

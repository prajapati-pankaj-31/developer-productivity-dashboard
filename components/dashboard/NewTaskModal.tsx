'use client';

import React, { useState } from 'react';
import { Project, Task, TaskPriority, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  teamMembers: User[];
  onAddTask: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  teamMembers,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [tagsInput, setTagsInput] = useState('');
  const [assigneeId, setAssigneeId] = useState(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-10');
  const [error, setError] = useState('');

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

  const assigneeOptions: SelectOption[] = teamMembers.map((m) => ({
    value: m.id,
    label: `${m.name} (${m.role.split(' ')[0]})`,
  }));

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
      subtasks: [
        { id: `sub-${Date.now()}-1`, title: 'Initial setup and requirements review', completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Core implementation & tests', completed: false },
      ],
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

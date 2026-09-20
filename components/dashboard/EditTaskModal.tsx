'use client';

import React, { useState, useEffect } from 'react';
import { Project, Task, TaskPriority, TaskStatus, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { Trash2, Plus, X } from 'lucide-react';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  teamMembers: User[];
  currentUserId?: string;
  onUpdateTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  projects,
  teamMembers,
  currentUserId,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('in_progress');
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [loggedHours, setLoggedHours] = useState('0');
  const [tagsInput, setTagsInput] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [branchName, setBranchName] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setProjectId(task.projectId || projects[0]?.id || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'in_progress');
      setEstimatedHours(String(task.estimatedHours ?? 4));
      setLoggedHours(String(task.loggedHours ?? 0));
      setTagsInput((task.tags || []).join(', '));
      setAssigneeId(task.assignee?.id || teamMembers[0]?.id || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setBranchName(task.branchName || '');
      setPrNumber(task.prNumber ? String(task.prNumber) : '');
      setSubtasks(task.subtasks || []);
      setError('');
      setIsDeleting(false);
    }
  }, [task, projects, teamMembers]);

  if (!task) return null;

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

  const statusOptions: SelectOption<TaskStatus>[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'completed', label: 'Completed' },
  ];

  const assigneeOptions: SelectOption[] = teamMembers.map((m) => {
    const isMe = currentUserId && m.id === currentUserId;
    return {
      value: m.id,
      label: isMe ? `⭐ You (${m.name} - ${m.role})` : `${m.name} (${m.role})`,
    };
  });

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${prev.length + 1}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSubtaskLocal = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

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

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      projectId: selectedProject ? selectedProject.id : task.projectId,
      projectName: selectedProject ? selectedProject.name : task.projectName,
      priority,
      status,
      assignee: selectedAssignee || task.assignee,
      dueDate: dueDate || task.dueDate,
      estimatedHours: parseFloat(estimatedHours) || task.estimatedHours || 4,
      loggedHours: parseFloat(loggedHours) || 0,
      subtasks,
      tags: tags.length > 0 ? tags : task.tags,
      branchName: branchName.trim() || undefined,
      prNumber: prNumber.trim() ? parseInt(prNumber.trim(), 10) : undefined,
    };

    onUpdateTask(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteTask && task) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Sprint Task"
      description={`Update task details, sprint assignment, or logged hours for ${task.title}.`}
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

        {/* Project & Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project
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
              Status
            </label>
            <Select
              value={status}
              onChange={(val) => setStatus(val as TaskStatus)}
              options={statusOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Priority & Assignee row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        {/* Due Date & Hours row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Logged Hours
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={loggedHours}
              onChange={(e) => setLoggedHours(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Git Branch & PR Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Git Branch Name (Optional)
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="feat/auth-rate-limit"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              GitHub PR # (Optional)
            </label>
            <input
              type="number"
              min="1"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              placeholder="104"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Task Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context, acceptance criteria, or technical references..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
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
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Subtask checklist manager */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Checklist Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleToggleSubtaskLocal(st.id)}
                    className="h-3.5 w-3.5 rounded border-zinc-400 text-indigo-500 focus:ring-indigo-500/20 cursor-pointer shrink-0 accent-indigo-500"
                  />
                  <span
                    className={`truncate ${
                      st.completed
                        ? 'line-through text-zinc-400'
                        : 'text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {st.title}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  className="text-zinc-400 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                  title="Remove subtask"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new subtask input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Add new subtask item..."
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleAddSubtask}
              className="flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation or Normal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {onDeleteTask && (
            <div>
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-400 font-semibold">Delete permanently?</span>
                  <Button
                    variant="danger"
                    size="sm"
                    type="button"
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setIsDeleting(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-400 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Task</span>
                </button>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 ml-auto">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

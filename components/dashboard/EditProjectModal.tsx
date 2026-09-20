'use client';

import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, User } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { Trash2, Tag } from 'lucide-react';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  teamMembers: User[];
  currentUserId?: string;
  onUpdateProject: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

const statusOptions: SelectOption<ProjectStatus>[] = [
  { value: 'on_track', label: '🟢 On Track' },
  { value: 'at_risk', label: '🟡 At Risk' },
  { value: 'delayed', label: '🔴 Delayed' },
  { value: 'completed', label: '🔵 Completed' },
];

const presetColors = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#3b82f6',
  '#f43f5e',
];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  teamMembers,
  currentUserId,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('on_track');
  const [deadline, setDeadline] = useState('');
  const [repository, setRepository] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [leadId, setLeadId] = useState('');
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setStatus(project.status || 'on_track');
      setDeadline(project.deadline ? project.deadline.split('T')[0] : '');
      setRepository(project.repository || '');
      setTechStackInput((project.techStack || []).join(', '));
      setLeadId(project.lead?.id || currentUserId || teamMembers[0]?.id || '');
      setSelectedColor(project.color || presetColors[0]);
      setError('');
      setIsDeleting(false);
    }
  }, [project, teamMembers, currentUserId]);

  if (!project) return null;

  const leadOptions: SelectOption[] = teamMembers.map((m) => {
    const isMe = currentUserId && m.id === currentUserId;
    return {
      value: m.id,
      label: isMe ? `⭐ You (${m.name} - ${m.role})` : `${m.name} (${m.role})`,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
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
      setError('Please provide at least one tech stack tag');
      return;
    }

    const selectedLead = teamMembers.find((m) => m.id === leadId) || project.lead;

    const updatedProject: Project = {
      ...project,
      name: name.trim(),
      description: description.trim(),
      status,
      deadline: deadline || project.deadline,
      repository: repository.trim() || project.repository,
      techStack,
      lead: selectedLead,
      color: selectedColor,
    };

    onUpdateProject(updatedProject);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteProject && project) {
      onDeleteProject(project.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Project • [${project.key}]`}
      description={`Update repository settings, team assignments, or status for ${project.name}.`}
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
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project Key
            </label>
            <input
              type="text"
              disabled
              value={project.key}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm font-mono font-bold text-zinc-500 uppercase text-center cursor-not-allowed"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError('');
            }}
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
              Status
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

        {/* Actions & Delete Confirmation */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {onDeleteProject && (
            <div>
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-400 font-semibold">Delete project?</span>
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
                  <span>Delete Project</span>
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

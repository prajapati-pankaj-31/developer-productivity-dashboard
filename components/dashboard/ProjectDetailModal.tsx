'use client';

import React from 'react';
import { Project, Task } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, getProjectStatusStyles } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProjectDetailModalProps {
  project: Project | null;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  onFilterByProject: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  tasks,
  isOpen,
  onClose,
  onFilterByProject,
}) => {
  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const statusStyles = getProjectStatusStyles(project.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.name}
      description={`Project Key: ${project.key} • Repository: ${project.repository}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Status & Progress Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Health Status:</span>
              <Badge
                variant={
                  project.status === 'on_track'
                    ? 'success'
                    : project.status === 'at_risk'
                    ? 'warning'
                    : 'danger'
                }
                dot
              >
                {statusStyles.label}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Target Deadline: <strong className="text-zinc-900 dark:text-zinc-200">{formatDate(project.deadline)}</strong>
            </p>
          </div>

          <div className="w-full sm:w-48">
            <div className="flex justify-between text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
              <span>Overall Completion</span>
              <span>{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} size="sm" variant="gradient" />
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
            About Project
          </h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Technology Stack & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md font-mono text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Contributors */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
            Project Contributors & Leads
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <Avatar user={member} size="sm" showStatus />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {member.name}
                    </span>
                    {member.id === project.lead.id && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                        Lead
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400 truncate">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tasks associated with project */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Sprint Tasks ({projectTasks.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterByProject(project.id);
                onClose();
              }}
            >
              View in Task Board
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {projectTasks.map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/60 flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      t.status === 'completed'
                        ? 'text-emerald-500'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  />
                  <span
                    className={`truncate font-medium ${
                      t.status === 'completed'
                        ? 'line-through text-zinc-500 dark:text-zinc-400'
                        : 'text-zinc-950 dark:text-white'
                    }`}
                  >
                    {t.title}
                  </span>
                </div>
                <span className="text-xs text-zinc-700 dark:text-zinc-300 shrink-0 font-mono font-medium">
                  {t.estimatedHours}h est.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

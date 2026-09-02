'use client';

import React from 'react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AvatarGroup } from '@/components/ui/Avatar';
import { getProjectStatusStyles, formatDate } from '@/lib/utils';
import { Calendar, CheckSquare, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelectProject?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
}) => {
  const statusStyles = getProjectStatusStyles(project.status);

  return (
    <div
      onClick={() => onSelectProject && onSelectProject(project)}
      className="rounded-xl border border-zinc-200/80 dark:border-indigo-950/60 bg-white dark:bg-gradient-to-b dark:from-[#0e1227]/90 dark:to-[#080a1c]/95 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.03)] hover:border-indigo-500/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08),inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Top bar: Key + Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {project.key}
            </span>
            <Badge
              variant={
                project.status === 'on_track'
                  ? 'success'
                  : project.status === 'at_risk'
                  ? 'warning'
                  : project.status === 'completed'
                  ? 'blue'
                  : 'danger'
              }
              dot
            >
              {statusStyles.label}
            </Badge>
          </div>
          <span className="text-xs text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Title and Description */}
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1">
          {project.name}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-700/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Progress & Metadata Section */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium">
            <CheckSquare className="h-3.5 w-3.5 text-zinc-400" />
            {project.completedTasks}/{project.totalTasks} Tasks
          </span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{project.progress}%</span>
        </div>
        <ProgressBar
          value={project.progress}
          size="xs"
          variant={project.progress === 100 ? 'success' : project.progress < 50 ? 'warning' : 'default'}
        />

        {/* Footer: Contributors & Deadline */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AvatarGroup users={project.members} size="xs" max={3} />
            <span className="text-[11px] text-zinc-400">Lead: {project.lead.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3 w-3 text-zinc-400" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

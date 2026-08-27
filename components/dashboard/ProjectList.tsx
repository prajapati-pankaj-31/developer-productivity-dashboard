'use client';

import React from 'react';
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { ProjectCardSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  onSelectProject: (project: Project) => void;
  onResetFilters?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading = false,
  onSelectProject,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="No active projects match your selected filters. Try clearing search filters."
        icon="projects"
        actionLabel={onResetFilters ? 'Clear Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelectProject={onSelectProject}
        />
      ))}
    </div>
  );
};

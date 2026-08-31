'use client';

import React, { useState, useMemo } from 'react';
import { TabType, Task, Project, TaskStatus, TaskFilterState, User } from '@/types';
import {
  CURRENT_USER,
  TEAM_MEMBERS,
  PRODUCTIVITY_METRICS,
  WEEKLY_PRODUCTIVITY_DATA,
  MOCK_PROJECTS,
  MOCK_TASKS,
  RECENT_ACTIVITIES,
} from '@/lib/mock-data';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { OverviewMetrics } from '@/components/dashboard/OverviewMetrics';
import { ProductivityChart } from '@/components/dashboard/ProductivityChart';
import { FocusTimerCard } from '@/components/dashboard/FocusTimerCard';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { TaskFilterBar } from '@/components/dashboard/TaskFilterBar';
import { TaskList } from '@/components/dashboard/TaskList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProjectDetailModal } from '@/components/dashboard/ProjectDetailModal';
import { NewTaskModal } from '@/components/dashboard/NewTaskModal';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  CheckSquare,
} from 'lucide-react';

export default function DashboardPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modals & Drawers
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Filters
  const [filters, setFilters] = useState<TaskFilterState>({
    searchQuery: '',
    projectId: 'all',
    priority: 'all',
    status: 'all',
  });

  const handleFilterChange = (newFilters: Partial<TaskFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      projectId: 'all',
      priority: 'all',
      status: 'all',
    });
  };

  // Task Actions
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          // If manually marked completed, auto-complete all subtasks
          const updatedSubtasks =
            newStatus === 'completed'
              ? t.subtasks.map((st) => ({ ...st, completed: true }))
              : t.subtasks;

          return { ...t, status: newStatus, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allCompleted =
            updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

          let nextStatus = t.status;
          if (allCompleted && t.status !== 'completed') {
            nextStatus = 'completed';
          } else if (!allCompleted && t.status === 'completed') {
            nextStatus = 'in_progress';
          }

          return {
            ...t,
            status: nextStatus,
            subtasks: updatedSubtasks,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleFilterByProject = (projectId: string) => {
    setFilters((prev) => ({ ...prev, projectId }));
    setActiveTab('tasks');
  };

  const handleUserStatusChange = (newStatus: User['status']) => {
    setCurrentUser((prev) => ({ ...prev, status: newStatus }));
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesBranch = task.branchName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesBranch) {
          return false;
        }
      }
      // Project
      if (filters.projectId !== 'all' && task.projectId !== filters.projectId) {
        return false;
      }
      // Priority
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      // Status
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(q);
        const matchesKey = project.key.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesTech = project.techStack.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesKey && !matchesDesc && !matchesTech) {
          return false;
        }
      }
      if (filters.projectId !== 'all' && project.id !== filters.projectId) {
        return false;
      }
      return true;
    });
  }, [projects, filters]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Futuristic Dynamic Ambient Background */}
      <DynamicBackground />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        projectsCount={projects.length}
        tasksCount={tasks.length}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        projectsCount={projects.length}
        tasksCount={tasks.length}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onNewTaskClick={() => setIsNewTaskModalOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
          isLoadingState={isLoadingState}
          onToggleLoadingState={() => setIsLoadingState(!isLoadingState)}
          onStatusChange={handleUserStatusChange}
        />

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Developer Productivity Hub
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Sprint #14
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Welcome back, {currentUser.name}. You have delivered 38 story points this sprint.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'overview' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'projects' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('projects')}
              >
                Projects ({projects.length})
              </Button>
              <Button
                variant={activeTab === 'tasks' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('tasks')}
              >
                Tasks ({tasks.length})
              </Button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 1. Overview KPI Summary Cards */}
              <section aria-labelledby="metrics-heading">
                <h2 id="metrics-heading" className="sr-only">
                  Productivity Metrics
                </h2>
                <OverviewMetrics
                  metrics={PRODUCTIVITY_METRICS}
                  isLoading={isLoadingState}
                />
              </section>

              {/* 2. Visual Charts & Deep Work Timer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductivityChart data={WEEKLY_PRODUCTIVITY_DATA} />
                </div>
                <div className="lg:col-span-1">
                  <FocusTimerCard />
                </div>
              </div>

              {/* 3. Active Projects Preview */}
              <section aria-labelledby="active-projects-heading" className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h2 id="active-projects-heading" className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Active Projects & Roadmaps
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    <span>View All Projects</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ProjectList
                  projects={filteredProjects}
                  isLoading={isLoadingState}
                  onSelectProject={setSelectedProject}
                  onResetFilters={handleResetFilters}
                />
              </section>

              {/* 4. Active Tasks & Sprint Work */}
              <section aria-labelledby="sprint-tasks-heading" className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h2 id="sprint-tasks-heading" className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Sprint Task Board
                    </h2>
                  </div>
                </div>

                {/* Filter and Search controls */}
                <TaskFilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  projects={projects}
                  totalResults={filteredTasks.length}
                  totalTasks={tasks.length}
                />

                {/* Task List Grid */}
                <TaskList
                  tasks={filteredTasks}
                  isLoading={isLoadingState}
                  onStatusChange={handleStatusChange}
                  onToggleSubtask={handleToggleSubtask}
                  onResetFilters={handleResetFilters}
                />
              </section>

              {/* 5. Live Activity Feed */}
              <section aria-labelledby="activity-heading" className="pt-2">
                <ActivityFeed
                  activities={RECENT_ACTIVITIES}
                  title="Team Activity Stream"
                />
              </section>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Engineering Projects ({filteredProjects.length})
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Active repositories, roadmap deliverables, and team assignments
                  </p>
                </div>
              </div>

              {/* Search / Project Filter */}
              <TaskFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                projects={projects}
                totalResults={filteredProjects.length}
                totalTasks={projects.length}
              />

              <ProjectList
                projects={filteredProjects}
                isLoading={isLoadingState}
                onSelectProject={setSelectedProject}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* TAB 3: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Sprint Tasks & Backlog ({filteredTasks.length})
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Track sprint deliverables, pull requests, and subtask completion
                  </p>
                </div>
                <Button size="sm" onClick={() => setIsNewTaskModalOpen(true)}>
                  + Create Task
                </Button>
              </div>

              {/* Filter controls */}
              <TaskFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                projects={projects}
                totalResults={filteredTasks.length}
                totalTasks={tasks.length}
              />

              {/* Task list with status tabs */}
              <TaskList
                tasks={filteredTasks}
                isLoading={isLoadingState}
                onStatusChange={handleStatusChange}
                onToggleSubtask={handleToggleSubtask}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* TAB 4: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="space-y-4 max-w-4xl">
              <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Engineering Telemetry & Activity Feed
                </h2>
                <p className="text-xs text-zinc-500">
                  Real-time Git commits, PR code reviews, staging deployments, and task completions
                </p>
              </div>

              <ActivityFeed
                activities={RECENT_ACTIVITIES}
                title="Full Engineering Activity Log"
              />
            </div>
          )}
        </main>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        tasks={tasks}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onFilterByProject={handleFilterByProject}
      />

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projects={projects}
        teamMembers={TEAM_MEMBERS}
        onAddTask={handleAddTask}
      />
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TabType, Task, Project, TaskStatus, TaskFilterState, User, ProductivityMetric, DailyProductivity, ActivityItem } from '@/types';
import {
  CURRENT_USER,
  TEAM_MEMBERS,
  PRODUCTIVITY_METRICS,
  WEEKLY_PRODUCTIVITY_DATA,
  MOCK_PROJECTS,
  MOCK_TASKS,
  RECENT_ACTIVITIES,
} from '@/lib/mock-data';
import { ApiClient } from '@/lib/api-client';
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
import { EditTaskModal } from '@/components/dashboard/EditTaskModal';
import { NewProjectModal } from '@/components/dashboard/NewProjectModal';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import { ProfileModal } from '@/components/dashboard/ProfileModal';
import { SettingsModal, WorkspaceSettings, defaultSettings } from '@/components/dashboard/SettingsModal';
import { KeyboardShortcutsModal } from '@/components/dashboard/KeyboardShortcutsModal';
import { AISprintCopilotModal } from '@/components/dashboard/AISprintCopilotModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/context/auth-context';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  FolderPlus,
  CheckSquare,
  Download,
  Bot,
} from 'lucide-react';

export default function DashboardPage() {
  const { user: authUser, logout: authLogout, isAuthenticated, updateUserLocal } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities, setActivities] = useState<ActivityItem[]>(RECENT_ACTIVITIES);
  const [metrics, setMetrics] = useState<ProductivityMetric[]>(PRODUCTIVITY_METRICS);
  const [weeklyData, setWeeklyData] = useState<DailyProductivity[]>(WEEKLY_PRODUCTIVITY_DATA);
  const [teamUsers, setTeamUsers] = useState<User[]>(TEAM_MEMBERS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState<boolean>(false);

  // Modals & Drawers
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(defaultSettings);
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Load Real-time Data from Backend REST API
  const refreshBackendData = useCallback(async () => {
    setIsLoadingState(true);
    const isAlive = await ApiClient.checkHealth();
    setIsLiveDbConnected(isAlive);

    if (isAlive) {
      try {
        const [fetchedProjects, fetchedTasks, fetchedActivities, fetchedUsers, overview] = await Promise.all([
          ApiClient.getProjects(),
          ApiClient.getTasks(),
          ApiClient.getActivities(),
          ApiClient.getUsers(),
          ApiClient.getAnalyticsOverview(),
        ]);

        if (fetchedProjects && fetchedProjects.length > 0) setProjects(fetchedProjects);
        if (fetchedTasks && fetchedTasks.length > 0) setTasks(fetchedTasks);
        if (fetchedActivities && fetchedActivities.length > 0) setActivities(fetchedActivities);
        if (fetchedUsers && fetchedUsers.length > 0) setTeamUsers(fetchedUsers);
        if (overview?.metrics && overview.metrics.length > 0) setMetrics(overview.metrics);
        if (overview?.weeklyProductivity && overview.weeklyProductivity.length > 0) {
          setWeeklyData(overview.weeklyProductivity);
        }
      } catch (err) {
        console.warn('⚠️ [Live DB] Error refreshing data, using cache:', err);
      } finally {
        setIsLoadingState(false);
      }
    } else {
      setIsLoadingState(false);
    }
  }, []);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData, authUser?.id]);

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

  // Task Actions (Optimistic UI + Real Database Sync)
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

    // Sync directly to backend database
    ApiClient.updateTaskStatus(taskId, newStatus).catch((err) => {
      console.warn('Backend status sync warning:', err);
    });
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

    // Sync directly to backend database
    ApiClient.toggleSubtask(taskId, subtaskId).catch((err) => {
      console.warn('Backend subtask toggle warning:', err);
    });
  };

  const handleAddTask = async (newTask: Task) => {
    // Optimistic UI update
    setTasks((prev) => [newTask, ...prev]);

    try {
      const created = await ApiClient.createTask({
        title: newTask.title,
        description: newTask.description,
        projectId: newTask.projectId,
        priority: newTask.priority,
        status: newTask.status,
        assigneeId: newTask.assignee.id,
        dueDate: newTask.dueDate,
        estimatedHours: newTask.estimatedHours,
        tags: newTask.tags,
        branchName: newTask.branchName,
        prNumber: newTask.prNumber,
        subtasks: newTask.subtasks.map((st) => ({ title: st.title, completed: st.completed })),
      });

      // Update with server ID
      setTasks((prev) => prev.map((t) => (t.id === newTask.id ? created : t)));
    } catch (err) {
      console.warn('Backend task create warning:', err);
    }
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleEditTask = async (updatedTask: Task) => {
    // Optimistic UI update
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    try {
      const synced = await ApiClient.updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        projectId: updatedTask.projectId,
        priority: updatedTask.priority,
        status: updatedTask.status,
        assigneeId: updatedTask.assignee.id,
        dueDate: updatedTask.dueDate,
        estimatedHours: updatedTask.estimatedHours,
        loggedHours: updatedTask.loggedHours,
        tags: updatedTask.tags,
        branchName: updatedTask.branchName,
        prNumber: updatedTask.prNumber,
        subtasks: updatedTask.subtasks,
      });
      setTasks((prev) => prev.map((t) => (t.id === synced.id ? synced : t)));
    } catch (err) {
      console.warn('Backend task update warning:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await ApiClient.deleteTask(taskId);
    } catch (err) {
      console.warn('Backend task deletion warning:', err);
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    // Optimistic UI update
    setProjects((prev) => [newProject, ...prev]);

    try {
      const created = await ApiClient.createProject({
        name: newProject.name,
        key: newProject.key,
        description: newProject.description,
        status: newProject.status,
        deadline: newProject.deadline,
        repository: newProject.repository,
        techStack: newProject.techStack,
        leadId: newProject.lead.id,
        color: newProject.color,
      });

      setProjects((prev) => prev.map((p) => (p.id === newProject.id ? created : p)));

      // Record Activity
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'task_completed',
        title: `Project Created: ${newProject.name}`,
        description: `Initialized project key [${newProject.key}] and roadmap.`,
        timestamp: 'Just now',
        user: authUser || CURRENT_USER,
        projectKey: newProject.key,
        badgeText: 'New Project',
      };
      setActivities((prev) => [newAct, ...prev]);

      if (authUser) {
        ApiClient.createActivity({
          type: 'task_completed',
          title: `Project Created: ${newProject.name}`,
          description: `Initialized project key [${newProject.key}] and roadmap.`,
          userId: authUser.id,
          projectKey: newProject.key,
          badgeText: 'New Project',
        }).catch(console.warn);
      }
    } catch (err) {
      console.warn('Backend project create warning:', err);
    }
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = async (updatedProj: Project) => {
    // Optimistic UI update
    setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    if (selectedProject?.id === updatedProj.id) {
      setSelectedProject(updatedProj);
    }

    try {
      const synced = await ApiClient.updateProject(updatedProj.id, {
        name: updatedProj.name,
        description: updatedProj.description,
        status: updatedProj.status,
        deadline: updatedProj.deadline,
        repository: updatedProj.repository,
        techStack: updatedProj.techStack,
        leadId: updatedProj.lead.id,
        color: updatedProj.color,
      });
      setProjects((prev) => prev.map((p) => (p.id === synced.id ? synced : p)));
      if (selectedProject?.id === synced.id) {
        setSelectedProject(synced);
      }
    } catch (err) {
      console.warn('Backend project update warning:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    // Optimistic UI update
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }

    try {
      await ApiClient.deleteProject(projectId);
    } catch (err) {
      console.warn('Backend project deletion warning:', err);
    }
  };

  const handleExportSprintData = () => {
    const dataToExport = {
      exportTimestamp: new Date().toISOString(),
      user: authUser?.name || 'Guest User',
      metrics,
      weeklyData,
      projects: projects.map((p) => ({
        key: p.key,
        name: p.name,
        progress: p.progress,
        tasksCount: p.totalTasks,
        completedTasks: p.completedTasks,
        status: p.status,
        techStack: p.techStack,
      })),
      tasks: tasks.map((t) => ({
        title: t.title,
        projectName: t.projectName,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee.name,
        dueDate: t.dueDate,
        loggedHours: t.loggedHours,
        estimatedHours: t.estimatedHours,
      })),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-productivity-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFocusSessionComplete = (minutes: number) => {
    const focusDelta = +(minutes / 60).toFixed(1);
    setWeeklyData((prev) =>
      prev.map((d) => (d.isToday ? { ...d, focusHours: +(d.focusHours + focusDelta).toFixed(1) } : d))
    );

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'commit',
      title: 'Deep Work Sprint Completed',
      description: `Logged ${minutes}m of uninterrupted deep work flow.`,
      timestamp: 'Just now',
      user: authUser || CURRENT_USER,
      projectKey: 'CORE',
      badgeText: `+${minutes}m Focus`,
    };
    setActivities((prev) => [newAct, ...prev]);

    if (authUser) {
      ApiClient.createActivity({
        type: 'commit',
        title: 'Deep Work Sprint Completed',
        description: `Logged ${minutes}m of uninterrupted deep work flow.`,
        userId: authUser.id,
        projectKey: 'CORE',
        badgeText: `+${minutes}m Focus`,
      }).catch(console.warn);
    }
  };

  const handleFilterByProject = (projectId: string) => {
    setFilters((prev) => ({ ...prev, projectId }));
    setActiveTab('tasks');
  };

  const handleUserStatusChange = (newStatus: User['status']) => {
    if (authUser) {
      updateUserLocal({ status: newStatus });
      ApiClient.updateUser(authUser.id, { status: newStatus }).catch((err) => {
        console.warn('User status sync warning:', err);
      });
    }
  };

  // Dynamic Team Directory (Database users + logged in user prioritized at top)
  const availableTeamMembers = useMemo(() => {
    if (!authUser) return teamUsers;
    const exists = teamUsers.some(
      (u) => u.id === authUser.id || u.email.toLowerCase() === authUser.email.toLowerCase()
    );
    if (exists) {
      return [
        authUser,
        ...teamUsers.filter(
          (u) => u.id !== authUser.id && u.email.toLowerCase() !== authUser.email.toLowerCase()
        ),
      ];
    }
    return [authUser, ...teamUsers];
  }, [teamUsers, authUser]);

  // Filtered Tasks
  const myTasks = useMemo(() => {
    if (!authUser) return [];
    return tasks.filter(
      (t) =>
        t.assignee.id === authUser.id ||
        t.assignee.email.toLowerCase() === authUser.email.toLowerCase()
    );
  }, [tasks, authUser]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Only My Tasks filter
      if (filters.onlyMyTasks && authUser) {
        const isMine =
          task.assignee.id === authUser.id ||
          task.assignee.email.toLowerCase() === authUser.email.toLowerCase();
        if (!isMine) {
          return false;
        }
      }
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
  }, [tasks, filters, authUser]);

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

  // User & Workspace Settings Handlers
  const handleSaveUser = (updatedUser: Partial<User>) => {
    if (authUser) {
      updateUserLocal(updatedUser);
      ApiClient.updateUser(authUser.id, updatedUser).catch((err) => {
        console.warn('User profile sync warning:', err);
      });
    }
  };

  const handleSaveSettings = (newSettings: WorkspaceSettings) => {
    setWorkspaceSettings(newSettings);
    if (newSettings.defaultTab && newSettings.defaultTab !== activeTab) {
      setActiveTab(newSettings.defaultTab);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsProfileModalOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsSettingsModalOpen(true);
      } else if (e.key === '1') {
        setActiveTab('overview');
      } else if (e.key === '2') {
        setActiveTab('projects');
      } else if (e.key === '3') {
        setActiveTab('tasks');
      } else if (e.key === '4') {
        setActiveTab('activity');
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNewTaskModalOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Futuristic Dynamic Ambient Background */}
      <DynamicBackground />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={authUser || CURRENT_USER}
        projectsCount={projects.length}
        tasksCount={tasks.length}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={authUser}
        projectsCount={projects.length}
        tasksCount={tasks.length}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={authUser}
          isAuthenticated={isAuthenticated}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onNewTaskClick={() => setIsNewTaskModalOpen(true)}
          onOpenAICopilot={() => setIsAICopilotOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
          onStatusChange={handleUserStatusChange}
          isLiveDbConnected={isLiveDbConnected}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={authLogout}
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
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Sprint #14
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {authUser ? (
                  <>
                    Welcome back, <span className="font-semibold text-zinc-200">{authUser.name}</span>{' '}
                    <span className="text-indigo-400">({authUser.role || 'Developer'})</span>. You have{' '}
                    <span className="font-semibold text-zinc-200">{myTasks.length}</span> task
                    {myTasks.length === 1 ? '' : 's'} assigned to you (
                    {myTasks.filter((t) => t.status === 'in_progress').length} in progress). Weekly focus
                    goal: <span className="text-emerald-400 font-semibold">{authUser.weeklyFocusGoalHours || 35}h</span>.
                  </>
                ) : (
                  '👤 Guest Mode: Viewing organization workspace. Sign in to view your assigned sprint tasks, log focus hours, and ship PRs.'
                )}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => setIsAICopilotOpen(true)}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-400/30 flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                <span>AI Copilot</span>
              </Button>
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
                  metrics={metrics}
                  isLoading={isLoadingState}
                />
              </section>

              {/* 2. Visual Charts & Deep Work Timer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductivityChart data={weeklyData} />
                </div>
                <div className="lg:col-span-1">
                  <FocusTimerCard onFocusSessionComplete={handleFocusSessionComplete} />
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
                  onSelectProject={handleOpenEditProject}
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
                  authUser={authUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />

                {/* Task List Grid */}
                <TaskList
                  tasks={filteredTasks}
                  isLoading={isLoadingState}
                  onStatusChange={handleStatusChange}
                  onToggleSubtask={handleToggleSubtask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onResetFilters={handleResetFilters}
                />
              </section>

              {/* 5. Live Activity Feed */}
              <section aria-labelledby="activity-heading" className="pt-2">
                <ActivityFeed
                  activities={activities}
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
                <Button
                  size="sm"
                  onClick={() => {
                    if (!authUser) {
                      setIsAuthModalOpen(true);
                      return;
                    }
                    setIsNewProjectModalOpen(true);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>+ Create Project</span>
                </Button>
              </div>

              {/* Search / Project Filter */}
              <TaskFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                projects={projects}
                totalResults={filteredProjects.length}
                totalTasks={projects.length}
                authUser={authUser}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />

              <ProjectList
                projects={filteredProjects}
                isLoading={isLoadingState}
                onSelectProject={handleOpenEditProject}
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSprintData}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export Sprint Report</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!authUser) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      setIsNewTaskModalOpen(true);
                    }}
                  >
                    + Create Task
                  </Button>
                </div>
              </div>

              {/* Filter controls */}
              <TaskFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                projects={projects}
                totalResults={filteredTasks.length}
                totalTasks={tasks.length}
                authUser={authUser}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />

              {/* Task list with status tabs */}
              <TaskList
                tasks={filteredTasks}
                isLoading={isLoadingState}
                onStatusChange={handleStatusChange}
                onToggleSubtask={handleToggleSubtask}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
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
                activities={activities}
                title="Full Engineering Activity Log"
                showFilters={true}
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
        onEditProject={handleOpenEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* New Project Creation Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        teamMembers={availableTeamMembers}
        currentUserId={authUser?.id}
        onCreateProject={handleCreateProject}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        teamMembers={availableTeamMembers}
        currentUserId={authUser?.id}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* New Task Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projects={projects}
        teamMembers={availableTeamMembers}
        currentUserId={authUser?.id}
        onAddTask={handleAddTask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        projects={projects}
        teamMembers={availableTeamMembers}
        currentUserId={authUser?.id}
        onUpdateTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Developer Profile & Identity Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={authUser || CURRENT_USER}
        onSaveUser={handleSaveUser}
      />

      {/* Workspace & Developer Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={workspaceSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Keyboard Shortcuts Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* AI Sprint Copilot & Daily Standup Modal (TASK 4) */}
      <AISprintCopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        currentUser={authUser}
        tasks={tasks}
        weeklyFocusHours={weeklyData.find((d) => d.isToday)?.focusHours || 6.5}
      />

      {/* Authentication (Login / Signup) Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Full Stack Engineer');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoFill = () => {
    setTab('login');
    setEmail('pankaj.prajapati@devhub.io');
    setPassword('DevPass123!');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        await login({ email, password });
        setSuccessMessage('Successfully signed in!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        await signup({
          name,
          email,
          password,
          role,
          weeklyFocusGoalHours: 35,
        });
        setSuccessMessage('Account created and signed in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication request failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-indigo-900/60 bg-gradient-to-b from-[#0f132b] via-[#0a0d20] to-[#070918] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-2xl text-zinc-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 mb-3 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {tab === 'login' ? 'Welcome to DevHub' : 'Join Engineering Team'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {tab === 'login'
                ? 'Sign in to access sprint tasks, focus hours, and metrics'
                : 'Create your developer profile & start tracking sprint velocity'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 mb-5 rounded-xl bg-[#070918]/80 border border-indigo-950/80">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage(null);
              }}
              className={cn(
                'py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
                tab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage(null);
              }}
              className={cn(
                'py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
                tab === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          {tab === 'login' && (
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-left hover:bg-indigo-900/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-[11px] font-medium text-indigo-300">
                    Quick Fill: Pankaj Prajapati
                  </div>
                  <div className="text-[10px] text-zinc-400">pankaj.prajapati@devhub.io</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-indigo-400 group-hover:underline">
                Autofill →
              </span>
            </button>
          )}

          {/* Status Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Pankaj Prajapati"
                      className="w-full rounded-xl border border-zinc-800 bg-[#0a0d20] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Engineering Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. AI & Full Stack Developer"
                      className="w-full rounded-xl border border-zinc-800 bg-[#0a0d20] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@devhub.io"
                  className="w-full rounded-xl border border-zinc-800 bg-[#0a0d20] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-[#0a0d20] pl-9 pr-10 py-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In to Dashboard' : 'Create Developer Profile'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

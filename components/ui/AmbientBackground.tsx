'use client';

import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only attach interactive mouse tracking on devices with fine pointer (desktop / mouse)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let rafId: number | null = null;
    let latestX = window.innerWidth / 2;
    let latestY = window.innerHeight / 3;

    const handleMouseMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty('--mouse-x', `${latestX}px`);
            containerRef.current.style.setProperty('--mouse-y', `${latestY}px`);
          }
          rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={
        {
          '--mouse-x': '50%',
          '--mouse-y': '25%',
        } as React.CSSProperties
      }
    >
      {/* Developer Grid Texture Overlay */}
      <div className="absolute inset-0 bg-dev-grid opacity-60 dark:opacity-80" />

      {/* Ambient Floating Glow Orb 1 - Top Left / Indigo */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-blue-600/10 to-transparent blur-[110px] animate-ambient-1 dark:from-indigo-600/15 dark:via-blue-600/10"
      />

      {/* Ambient Floating Glow Orb 2 - Bottom Right / Violet */}
      <div
        className="absolute -bottom-40 -right-40 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-violet-600/15 via-purple-600/10 to-transparent blur-[120px] animate-ambient-2 dark:from-violet-600/15 dark:via-purple-600/10"
      />

      {/* Ambient Floating Glow Orb 3 - Middle Center / Soft Deep Blue */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent blur-[100px] animate-ambient-3 dark:from-blue-500/10 dark:via-indigo-500/8"
      />

      {/* Interactive Cursor Spotlight (Desktop GPU accelerated) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.055), transparent 70%)',
        }}
      />
    </div>
  );
};

'use client';

import React, { useEffect, useRef } from 'react';

export const DynamicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only attach interactive mouse spotlight on devices with fine pointer (desktop / mouse)
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050713]"
      style={
        {
          '--mouse-x': '50%',
          '--mouse-y': '25%',
        } as React.CSSProperties
      }
    >
      {/* 1. Intelligently Placed Deep Atmospheric Base Lighting (Concentrated at Edges & Corners) */}
      <div
        className="absolute inset-0 opacity-85"
        style={{
          background:
            'radial-gradient(ellipse 800px 450px at 85% 5%, rgba(217, 70, 239, 0.12) 0%, transparent 65%), radial-gradient(ellipse 650px 500px at 5% 75%, rgba(168, 85, 247, 0.14) 0%, transparent 60%), radial-gradient(ellipse 900px 380px at 75% 95%, rgba(0, 240, 255, 0.09) 0%, transparent 65%), radial-gradient(circle 500px at 98% 45%, rgba(56, 189, 248, 0.11) 0%, transparent 55%), radial-gradient(circle 800px at 50% 50%, rgba(15, 23, 42, 0.5) 0%, #050713 100%)',
        }}
      />

      {/* 2. Developer Coordinate Grid */}
      <div className="absolute inset-0 bg-dev-grid opacity-45" />

      {/* 3. SVG High-Fidelity Constellation & Wave Graphics */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Multi-Stop Gradients */}
          <linearGradient id="purple-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="bottom-mesh-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
          </linearGradient>

          {/* Neon Glow Filters */}
          <filter id="node-glow-violet" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="node-glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* A. LEFT CONSTELLATION NETWORK WEB (Behind Lower Sidebar & Overview Area)  */}
        {/* ========================================================================= */}
        <g className="animate-constellation" filter="url(#node-glow-violet)">
          {/* Vector Network Connection Lines */}
          <g stroke="url(#purple-line-grad)" strokeWidth="0.9" strokeLinecap="round">
            <line x1="45" y1="560" x2="115" y2="520" />
            <line x1="115" y1="520" x2="190" y2="490" />
            <line x1="115" y1="520" x2="165" y2="615" />
            <line x1="45" y1="560" x2="75" y2="655" />
            <line x1="75" y1="655" x2="165" y2="615" />
            <line x1="165" y1="615" x2="255" y2="585" />
            <line x1="190" y1="490" x2="255" y2="585" />
            <line x1="75" y1="655" x2="35" y2="735" />
            <line x1="75" y1="655" x2="125" y2="730" />
            <line x1="165" y1="615" x2="215" y2="705" />
            <line x1="125" y1="730" x2="215" y2="705" />
            <line x1="255" y1="585" x2="265" y2="745" />
            <line x1="215" y1="705" x2="265" y2="745" />
            <line x1="35" y1="735" x2="125" y2="730" />
            <line x1="125" y1="730" x2="175" y2="810" />
            <line x1="215" y1="705" x2="175" y2="810" />
          </g>

          {/* Constellation Nodes */}
          <circle cx="115" cy="520" r="3" fill="#e879f9" className="animate-node-twinkle" />
          <circle cx="115" cy="520" r="7" fill="#e879f9" fillOpacity="0.2" />

          <circle cx="190" cy="490" r="2.2" fill="#38bdf8" />
          <circle cx="45" cy="560" r="1.8" fill="#c084fc" />

          <circle cx="165" cy="615" r="4" fill="#00f0ff" className="animate-node-twinkle" style={{ animationDelay: '1.2s' }} />
          <circle cx="165" cy="615" r="9" fill="#00f0ff" fillOpacity="0.18" />

          <circle cx="75" cy="655" r="2.5" fill="#d946ef" />

          <circle cx="255" cy="585" r="3" fill="#a855f7" className="animate-node-twinkle" style={{ animationDelay: '2.4s' }} />
          <circle cx="255" cy="585" r="6" fill="#a855f7" fillOpacity="0.18" />

          <circle cx="35" cy="735" r="2" fill="#38bdf8" />

          <circle cx="125" cy="730" r="3.5" fill="#e879f9" className="animate-node-twinkle" style={{ animationDelay: '0.8s' }} />
          <circle cx="125" cy="730" r="8" fill="#e879f9" fillOpacity="0.18" />

          <circle cx="215" cy="705" r="3" fill="#00f0ff" />
          <circle cx="215" cy="705" r="7" fill="#00f0ff" fillOpacity="0.16" />

          <circle cx="265" cy="745" r="2.2" fill="#c084fc" />
          <circle cx="175" cy="810" r="2.5" fill="#38bdf8" />
        </g>

        {/* ========================================================================= */}
        {/* B. TOP-RIGHT CONSTELLATION (Perimeter placement away from headings)       */}
        {/* ========================================================================= */}
        <g filter="url(#node-glow-violet)" opacity="0.75">
          <g stroke="url(#purple-line-grad)" strokeWidth="0.75" strokeDasharray="3 5">
            <line x1="1120" y1="75" x2="1050" y2="45" />
            <line x1="1120" y1="75" x2="1190" y2="40" />
            <line x1="1120" y1="75" x2="1235" y2="105" />
            <line x1="1120" y1="75" x2="1075" y2="135" />
            <line x1="1120" y1="75" x2="1165" y2="130" />
            <line x1="1050" y1="45" x2="1190" y2="40" />
            <line x1="1190" y1="40" x2="1235" y2="105" />
          </g>

          <circle cx="1120" cy="75" r="3.5" fill="#d946ef" className="animate-node-twinkle" />
          <circle cx="1120" cy="75" r="8" fill="#d946ef" fillOpacity="0.2" />

          <circle cx="1050" cy="45" r="2" fill="#38bdf8" />
          <circle cx="1190" cy="40" r="2.5" fill="#e879f9" />
          <circle cx="1235" cy="105" r="3" fill="#00f0ff" className="animate-node-twinkle" style={{ animationDelay: '1.5s' }} />
          <circle cx="1075" cy="135" r="2" fill="#818cf8" />
          <circle cx="1165" cy="130" r="2" fill="#e879f9" />
        </g>

        {/* ========================================================================= */}
        {/* C. BOTTOM DIGITAL FLOWING MESH WAVES (Electric Cyan / Indigo Stream)      */}
        {/* ========================================================================= */}
        <g className="animate-mesh-bottom">
          <path
            d="M 50,830 C 320,770 580,880 920,810 C 1140,760 1320,840 1520,790"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="2.5"
            filter="url(#node-glow-cyan)"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />
          <path
            d="M 70,815 C 340,755 600,865 940,795 C 1160,745 1340,825 1540,775"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="1.2"
            strokeDasharray="2 6"
            opacity="0.8"
            fill="none"
          />
          <path
            d="M 30,845 C 300,785 560,895 900,825 C 1120,775 1300,855 1500,805"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.55"
            fill="none"
          />

          <circle cx="520" cy="850" r="2" fill="#00f0ff" />
          <circle cx="780" cy="825" r="2.5" fill="#38bdf8" />
          <circle cx="1060" cy="785" r="2" fill="#00f0ff" />
          <circle cx="1280" cy="820" r="2.5" fill="#818cf8" />
        </g>

        {/* ========================================================================= */}
        {/* D. RIGHT-SIDE NEON LIGHT RAY & GLOWING STAR                               */}
        {/* ========================================================================= */}
        <g transform="translate(1415, 395)" className="animate-ray-pulse" filter="url(#node-glow-cyan)">
          <circle cx="0" cy="0" r="3.5" fill="#00f0ff" />
          <circle cx="0" cy="0" r="11" fill="#00f0ff" fillOpacity="0.2" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.8" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.8" />
        </g>
      </svg>

      {/* 4. Interactive Desktop Mouse Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.035), transparent 75%)',
        }}
      />
    </div>
  );
};

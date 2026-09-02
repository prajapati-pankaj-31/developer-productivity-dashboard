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
      {/* 1. Deep Atmospheric Ambient Lighting (Clearly visible across sidebar & main content) */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 750px 480px at 15% 78%, rgba(217, 70, 239, 0.18) 0%, transparent 68%), radial-gradient(ellipse 800px 450px at 50% 12%, rgba(168, 85, 247, 0.16) 0%, transparent 68%), radial-gradient(ellipse 700px 600px at 94% 42%, rgba(56, 189, 248, 0.15) 0%, transparent 65%), radial-gradient(ellipse 850px 420px at 80% 92%, rgba(0, 240, 255, 0.14) 0%, transparent 65%), radial-gradient(circle 900px at 50% 50%, rgba(15, 23, 42, 0.45) 0%, #050713 100%)',
        }}
      />

      {/* 2. Developer Coordinate Grid Pattern */}
      <div className="absolute inset-0 bg-dev-grid opacity-50" />

      {/* 3. Full-Viewport High-Fidelity SVG Constellation & Network Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Multi-Stop Network Line Gradients */}
          <linearGradient id="purple-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="cyan-line-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="bottom-mesh-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>

          {/* Node Glow Filters */}
          <filter id="node-glow-violet" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="node-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* A. LEFT / SIDEBAR CONSTELLATION NETWORK (Clearly visible in lower/mid area) */}
        {/* ========================================================================= */}
        <g className="animate-constellation" filter="url(#node-glow-violet)">
          {/* Connecting Lines */}
          <g stroke="url(#purple-line-grad)" strokeWidth="1" strokeLinecap="round" opacity="0.85">
            <line x1="35" y1="480" x2="95" y2="430" />
            <line x1="95" y1="430" x2="175" y2="410" />
            <line x1="95" y1="430" x2="140" y2="520" />
            <line x1="35" y1="480" x2="65" y2="580" />
            <line x1="65" y1="580" x2="140" y2="520" />
            <line x1="140" y1="520" x2="230" y2="490" />
            <line x1="175" y1="410" x2="230" y2="490" />
            <line x1="65" y1="580" x2="40" y2="680" />
            <line x1="65" y1="580" x2="120" y2="660" />
            <line x1="140" y1="520" x2="195" y2="640" />
            <line x1="120" y1="660" x2="195" y2="640" />
            <line x1="230" y1="490" x2="260" y2="670" />
            <line x1="195" y1="640" x2="260" y2="670" />
            <line x1="40" y1="680" x2="110" y2="760" />
            <line x1="120" y1="660" x2="110" y2="760" />
            <line x1="110" y1="760" x2="185" y2="780" />
            <line x1="195" y1="640" x2="185" y2="780" />
            <line x1="260" y1="670" x2="185" y2="780" />
            <line x1="185" y1="780" x2="270" y2="820" />
            <line x1="230" y1="490" x2="310" y2="420" strokeDasharray="3 4" opacity="0.65" />
            <line x1="260" y1="670" x2="350" y2="610" strokeDasharray="3 4" opacity="0.65" />
            <line x1="270" y1="820" x2="380" y2="790" strokeDasharray="3 4" opacity="0.65" />
          </g>

          {/* Glowing Constellation Nodes */}
          <circle cx="95" cy="430" r="3.5" fill="#e879f9" className="animate-node-twinkle" />
          <circle cx="95" cy="430" r="8" fill="#e879f9" fillOpacity="0.25" />

          <circle cx="175" cy="410" r="2.5" fill="#38bdf8" />
          <circle cx="35" cy="480" r="2.2" fill="#c084fc" />

          <circle cx="140" cy="520" r="4.5" fill="#00f0ff" className="animate-node-twinkle" style={{ animationDelay: '1.2s' }} />
          <circle cx="140" cy="520" r="10" fill="#00f0ff" fillOpacity="0.22" />

          <circle cx="65" cy="580" r="3" fill="#d946ef" />

          <circle cx="230" cy="490" r="3.5" fill="#a855f7" className="animate-node-twinkle" style={{ animationDelay: '2.4s' }} />
          <circle cx="230" cy="490" r="8" fill="#a855f7" fillOpacity="0.2" />

          <circle cx="40" cy="680" r="2.5" fill="#38bdf8" />

          <circle cx="120" cy="660" r="4" fill="#e879f9" className="animate-node-twinkle" style={{ animationDelay: '0.8s' }} />
          <circle cx="120" cy="660" r="9" fill="#e879f9" fillOpacity="0.22" />

          <circle cx="195" cy="640" r="3.5" fill="#00f0ff" />
          <circle cx="195" cy="640" r="8" fill="#00f0ff" fillOpacity="0.2" />

          <circle cx="260" cy="670" r="3" fill="#c084fc" />
          <circle cx="110" cy="760" r="3" fill="#38bdf8" />
          <circle cx="185" cy="780" r="4.5" fill="#d946ef" className="animate-node-twinkle" style={{ animationDelay: '1.8s' }} />
          <circle cx="185" cy="780" r="10" fill="#d946ef" fillOpacity="0.22" />
          <circle cx="270" cy="820" r="2.8" fill="#00f0ff" />
        </g>

        {/* ========================================================================= */}
        {/* B. MID-LEFT TO CENTER WEB (Between Sidebar & Cards Area)                   */}
        {/* ========================================================================= */}
        <g opacity="0.8" filter="url(#node-glow-violet)">
          <g stroke="url(#purple-line-grad)" strokeWidth="0.9" strokeDasharray="3 4">
            <line x1="310" y1="210" x2="390" y2="160" />
            <line x1="390" y1="160" x2="480" y2="190" />
            <line x1="310" y1="210" x2="360" y2="300" />
            <line x1="360" y1="300" x2="480" y2="190" />
            <line x1="480" y1="190" x2="570" y2="140" />
            <line x1="360" y1="300" x2="440" y2="350" />
            <line x1="440" y1="350" x2="550" y2="310" />
            <line x1="570" y1="140" x2="550" y2="310" />
          </g>

          <circle cx="310" cy="210" r="2.5" fill="#818cf8" />
          <circle cx="390" cy="160" r="3.5" fill="#d946ef" className="animate-node-twinkle" style={{ animationDelay: '2s' }} />
          <circle cx="390" cy="160" r="7" fill="#d946ef" fillOpacity="0.2" />
          <circle cx="480" cy="190" r="2.8" fill="#38bdf8" />
          <circle cx="360" cy="300" r="2.2" fill="#c084fc" />
          <circle cx="570" cy="140" r="3" fill="#00f0ff" />
          <circle cx="440" cy="350" r="2.5" fill="#e879f9" />
          <circle cx="550" cy="310" r="3.2" fill="#38bdf8" className="animate-node-twinkle" style={{ animationDelay: '1.4s' }} />
        </g>

        {/* ========================================================================= */}
        {/* C. TOP-RIGHT & HEADER CONSTELLATION (Visible in upper right atmosphere)   */}
        {/* ========================================================================= */}
        <g filter="url(#node-glow-cyan)" opacity="0.9">
          <g stroke="url(#cyan-line-grad)" strokeWidth="0.95" strokeLinecap="round">
            <line x1="1080" y1="80" x2="1160" y2="40" />
            <line x1="1160" y1="40" x2="1240" y2="35" />
            <line x1="1160" y1="40" x2="1205" y2="120" />
            <line x1="1080" y1="80" x2="1130" y2="155" />
            <line x1="1130" y1="155" x2="1205" y2="120" />
            <line x1="1240" y1="35" x2="1310" y2="90" />
            <line x1="1205" y1="120" x2="1310" y2="90" />
            <line x1="1310" y1="90" x2="1390" y2="60" />
            <line x1="1205" y1="120" x2="1280" y2="185" />
            <line x1="1310" y1="90" x2="1280" y2="185" />
            <line x1="1280" y1="185" x2="1370" y2="170" />
            <line x1="1390" y1="60" x2="1370" y2="170" />
          </g>

          <circle cx="1080" cy="80" r="2.5" fill="#38bdf8" />
          <circle cx="1160" cy="40" r="4" fill="#d946ef" className="animate-node-twinkle" style={{ animationDelay: '0.5s' }} />
          <circle cx="1160" cy="40" r="9" fill="#d946ef" fillOpacity="0.25" />

          <circle cx="1240" cy="35" r="3" fill="#e879f9" />
          <circle cx="1130" cy="155" r="2.5" fill="#818cf8" />

          <circle cx="1205" cy="120" r="4.5" fill="#00f0ff" className="animate-node-twinkle" style={{ animationDelay: '1.6s' }} />
          <circle cx="1205" cy="120" r="10" fill="#00f0ff" fillOpacity="0.25" />

          <circle cx="1310" cy="90" r="3.2" fill="#38bdf8" />
          <circle cx="1390" cy="60" r="2.8" fill="#c084fc" />
          <circle cx="1280" cy="185" r="3.5" fill="#e879f9" className="animate-node-twinkle" style={{ animationDelay: '2.8s' }} />
          <circle cx="1370" cy="170" r="3" fill="#00f0ff" />
        </g>

        {/* ========================================================================= */}
        {/* D. CENTER-RIGHT MATRIX WEB (Visible in space between timer & project cards)*/}
        {/* ========================================================================= */}
        <g opacity="0.8" filter="url(#node-glow-violet)">
          <g stroke="url(#purple-line-grad)" strokeWidth="0.85" strokeDasharray="4 4">
            <line x1="1120" y1="360" x2="1210" y2="320" />
            <line x1="1210" y1="320" x2="1320" y2="350" />
            <line x1="1120" y1="360" x2="1170" y2="440" />
            <line x1="1170" y1="440" x2="1270" y2="420" />
            <line x1="1210" y1="320" x2="1270" y2="420" />
            <line x1="1320" y1="350" x2="1380" y2="410" />
            <line x1="1270" y1="420" x2="1380" y2="410" />
            <line x1="1170" y1="440" x2="1240" y2="520" />
            <line x1="1270" y1="420" x2="1330" y2="500" />
            <line x1="1240" y1="520" x2="1330" y2="500" />
          </g>

          <circle cx="1120" cy="360" r="2.5" fill="#818cf8" />
          <circle cx="1210" cy="320" r="3.5" fill="#00f0ff" className="animate-node-twinkle" style={{ animationDelay: '1.1s' }} />
          <circle cx="1210" cy="320" r="8" fill="#00f0ff" fillOpacity="0.22" />
          <circle cx="1320" cy="350" r="2.8" fill="#e879f9" />
          <circle cx="1170" cy="440" r="2.4" fill="#38bdf8" />
          <circle cx="1270" cy="420" r="3.5" fill="#d946ef" className="animate-node-twinkle" style={{ animationDelay: '2.2s' }} />
          <circle cx="1380" cy="410" r="2.8" fill="#00f0ff" />
          <circle cx="1240" cy="520" r="2.6" fill="#c084fc" />
          <circle cx="1330" cy="500" r="3.2" fill="#38bdf8" />
        </g>

        {/* ========================================================================= */}
        {/* E. BOTTOM DIGITAL FLOWING MESH WAVES (Electric Cyan / Indigo Stream)      */}
        {/* ========================================================================= */}
        <g className="animate-mesh-bottom">
          <path
            d="M 30,830 C 300,760 560,880 920,800 C 1140,750 1320,830 1520,780"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="3"
            filter="url(#node-glow-cyan)"
            strokeLinecap="round"
            opacity="0.85"
            fill="none"
          />
          <path
            d="M 50,810 C 320,740 580,860 940,785 C 1160,735 1340,815 1540,765"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="1.6"
            strokeDasharray="3 5"
            opacity="0.9"
            fill="none"
          />
          <path
            d="M 10,850 C 280,780 540,900 900,820 C 1120,770 1300,850 1500,795"
            stroke="url(#bottom-mesh-grad)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.75"
            fill="none"
          />

          {/* Wave Nodes */}
          <circle cx="280" cy="790" r="3" fill="#00f0ff" className="animate-node-twinkle" />
          <circle cx="280" cy="790" r="7" fill="#00f0ff" fillOpacity="0.25" />
          <circle cx="560" cy="840" r="2.8" fill="#38bdf8" />
          <circle cx="780" cy="815" r="3.5" fill="#e879f9" className="animate-node-twinkle" style={{ animationDelay: '1.7s' }} />
          <circle cx="1060" cy="775" r="3" fill="#00f0ff" />
          <circle cx="1280" cy="810" r="3.2" fill="#818cf8" />
          <circle cx="1440" cy="780" r="2.5" fill="#38bdf8" />
        </g>

        {/* ========================================================================= */}
        {/* F. RIGHT-SIDE NEON LIGHT RAY & GLOWING STAR                               */}
        {/* ========================================================================= */}
        <g transform="translate(1415, 395)" className="animate-ray-pulse" filter="url(#node-glow-cyan)">
          <circle cx="0" cy="0" r="4" fill="#00f0ff" />
          <circle cx="0" cy="0" r="12" fill="#00f0ff" fillOpacity="0.25" />
          <line x1="-24" y1="0" x2="24" y2="0" stroke="#00f0ff" strokeWidth="1.4" strokeOpacity="0.85" />
          <line x1="0" y1="-24" x2="0" y2="24" stroke="#00f0ff" strokeWidth="1.4" strokeOpacity="0.85" />
        </g>
      </svg>

      {/* 4. Scattered Floating Micro-Particles across the Viewport */}
      <div className="absolute top-[18%] left-[8%] w-1.5 h-1.5 rounded-full bg-purple-400/50 blur-[0.5px] animate-particle-float" />
      <div className="absolute top-[35%] left-[22%] w-1 h-1 rounded-full bg-cyan-400/45 blur-[0.5px] animate-subtle-particle" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[60%] left-[14%] w-1.5 h-1.5 rounded-full bg-indigo-400/50 blur-[0.5px] animate-particle-float" style={{ animationDelay: '5s' }} />
      <div className="absolute top-[82%] left-[6%] w-1.5 h-1.5 rounded-full bg-purple-400/55 blur-[0.5px] animate-subtle-particle" style={{ animationDelay: '1.5s' }} />

      <div className="absolute top-[14%] right-[28%] w-1 h-1 rounded-full bg-cyan-400/40 blur-[0.5px] animate-particle-float" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[28%] right-[12%] w-1.5 h-1.5 rounded-full bg-indigo-400/50 blur-[0.5px] animate-subtle-particle" style={{ animationDelay: '4.5s' }} />
      <div className="absolute top-[52%] right-[22%] w-1 h-1 rounded-full bg-purple-400/45 blur-[0.5px] animate-particle-float" style={{ animationDelay: '7s' }} />
      <div className="absolute top-[75%] right-[8%] w-1.5 h-1.5 rounded-full bg-cyan-400/55 blur-[0.5px] animate-subtle-particle" style={{ animationDelay: '6s' }} />
      <div className="absolute top-[88%] right-[32%] w-1.5 h-1.5 rounded-full bg-indigo-400/45 blur-[0.5px] animate-particle-float" style={{ animationDelay: '3.8s' }} />

      {/* 5. Interactive Desktop Mouse Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.05), transparent 75%)',
        }}
      />
    </div>
  );
};

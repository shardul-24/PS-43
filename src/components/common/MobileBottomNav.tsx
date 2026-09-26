'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Plus,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  X,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenTour?: () => void;
  onOpenAi?: () => void;
}

export function MobileBottomNav({ onOpenTour, onOpenAi }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const currentRole = pathname.startsWith('/government')
    ? 'Government'
    : pathname.startsWith('/university')
    ? 'University'
    : pathname.startsWith('/startup')
    ? 'Startup'
    : pathname.startsWith('/citizen')
    ? 'Citizen'
    : 'All';

  return (
    <>
      {/* Role Switcher Sheet for iPhone / Mobile */}
      {showRoleDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
          <div
            className="flex-1"
            onClick={() => setShowRoleDrawer(false)}
          />
          <div className="relative rounded-t-3xl border-t border-slate-200 bg-white p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Jharkhand Stakeholder Views
                </span>
                <h3 className="text-base font-bold text-slate-900">Switch Platform Role</h3>
              </div>
              <button
                onClick={() => setShowRoleDrawer(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/citizen"
                onClick={() => setShowRoleDrawer(false)}
                className={`flex flex-col rounded-xl border p-3 transition ${
                  pathname.startsWith('/citizen') && !pathname.includes('leaderboard') && !pathname.includes('report')
                    ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Users className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <span className="mt-2 text-xs font-bold">Citizen Portal</span>
                <span className="text-[10px] text-slate-500">Field Reports & Impact</span>
              </Link>

              <Link
                href="/government"
                onClick={() => setShowRoleDrawer(false)}
                className={`flex flex-col rounded-xl border p-3 transition ${
                  pathname.startsWith('/government')
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <span className="mt-2 text-xs font-bold">Government</span>
                <span className="text-[10px] text-slate-500">Command & Routing</span>
              </Link>

              <Link
                href="/university"
                onClick={() => setShowRoleDrawer(false)}
                className={`flex flex-col rounded-xl border p-3 transition ${
                  pathname.startsWith('/university')
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <span className="mt-2 text-xs font-bold">University</span>
                <span className="text-[10px] text-slate-500">Research & Squads</span>
              </Link>

              <Link
                href="/startup"
                onClick={() => setShowRoleDrawer(false)}
                className={`flex flex-col rounded-xl border p-3 transition ${
                  pathname.startsWith('/startup')
                    ? 'border-purple-500 bg-purple-50/70 text-purple-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <span className="mt-2 text-xs font-bold">Startup & MSME</span>
                <span className="text-[10px] text-slate-500">Grants & Hardware</span>
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/projects"
                onClick={() => setShowRoleDrawer(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 p-2 text-xs font-semibold text-slate-800"
              >
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                <span>Projects</span>
              </Link>
              <Link
                href="/citizen/leaderboard"
                onClick={() => setShowRoleDrawer(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 p-2 text-xs font-semibold text-slate-800"
              >
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>Ranks</span>
              </Link>
              {onOpenTour && (
                <button
                  onClick={() => {
                    setShowRoleDrawer(false);
                    onOpenTour();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-300/40 p-2 text-xs font-semibold text-amber-800"
                >
                  <PlayCircle className="h-3.5 w-3.5 text-amber-600" />
                  <span>5-Min Tour</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 block md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md pb-safe"
      >
        <div className="flex items-center justify-around px-2 py-1.5 h-14">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[10px] font-medium transition ${
              isActive('/') ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className={`h-5 w-5 mb-0.5 ${isActive('/') ? 'stroke-[2.5px] text-blue-900' : ''}`} />
            <span>Home</span>
          </Link>

          {/* 2. Challenges */}
          <Link
            href="/challenges"
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[10px] font-medium transition ${
              isActive('/challenges') ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className={`h-5 w-5 mb-0.5 ${isActive('/challenges') ? 'stroke-[2.5px] text-blue-900' : ''}`} />
            <span>Explore</span>
          </Link>

          {/* 3. Center Action: Report Challenge (+) */}
          <Link
            href="/citizen/report"
            aria-label="Report Challenge"
            className="flex flex-col items-center justify-center -mt-5 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-white transition active:scale-95 group-hover:scale-105">
              <Plus className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Report</span>
          </Link>

          {/* 4. Switch Role View */}
          <button
            type="button"
            onClick={() => setShowRoleDrawer(true)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[10px] font-medium transition cursor-pointer ${
              pathname.startsWith('/government') ||
              pathname.startsWith('/university') ||
              pathname.startsWith('/startup') ||
              pathname.startsWith('/citizen')
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-5 w-5 mb-0.5" />
            <span>{currentRole}</span>
          </button>

          {/* 5. Sangam AI / Guide */}
          <button
            type="button"
            onClick={onOpenAi || (() => {})}
            className="flex flex-col items-center justify-center min-w-[56px] py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <Sparkles className="h-5 w-5 mb-0.5 text-emerald-600" />
            <span>Sangam AI</span>
          </button>
        </div>
      </nav>
    </>
  );
}

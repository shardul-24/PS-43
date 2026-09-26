'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Bell,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { NotificationItem } from '@/types';

interface HeaderProps {
  onOpenTour?: () => void;
}

export function Header({ onOpenTour }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [langHindi, setLangHindi] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/audit?limit=5')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const notifs: NotificationItem[] = json.data.slice(0, 4).map((log: any, idx: number) => ({
            id: `N-${idx}`,
            targetRole: log.actorRole,
            title: log.action.replace(/_/g, ' '),
            message: log.details,
            timestamp: log.timestamp,
            read: false,
            linkUrl: `/challenges/${log.challengeId}`,
            type: 'VERIFICATION',
          }));
          setNotifications(notifs);
        }
      })
      .catch(() => {});
  }, []);

  const handleResetDb = async () => {
    if (!confirm('Reset platform data to clean Jharkhand SIH 2026 seed state?')) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  // Determine current active role from route
  const currentRole = pathname.startsWith('/government')
    ? 'government'
    : pathname.startsWith('/university')
    ? 'university'
    : pathname.startsWith('/startup')
    ? 'startup'
    : pathname.startsWith('/citizen')
    ? 'citizen'
    : 'public';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top Govt of Jharkhand Official Bar */}
      <div className="border-b border-slate-100 bg-[#0B192C] px-4 py-1.5 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              {langHindi ? 'झारखंड सरकार' : 'Government of Jharkhand'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              {langHindi ? 'उच्च एवं तकनीकी शिक्षा विभाग' : 'Department of Higher & Technical Education'}
            </span>
            <span className="hidden rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline-block">
              SIH 2026 • PS26043
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => setLangHindi(!langHindi)}
              className="rounded px-2 py-0.5 font-medium transition hover:bg-white/10 text-amber-300 cursor-pointer"
              title="Toggle Hindi/English"
            >
              {langHindi ? 'English' : 'हिंदी'}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={handleResetDb}
              disabled={isResetting}
              className="flex items-center gap-1 text-slate-300 transition hover:text-amber-300 cursor-pointer"
              title="Reset to fresh seed demo data"
            >
              <RotateCcw className={`h-3 w-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{resetSuccess ? 'Reset Complete!' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white shadow-md shadow-blue-950/20 ring-1 ring-white/20 transition group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 tracking-tight text-lg leading-tight flex items-center gap-1.5">
              Samadhan Sangam
              <span className="text-xs font-normal text-emerald-600 font-hindi">
                (समाधान संगम)
              </span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Jharkhand Societal Innovation Platform
            </span>
          </div>
        </Link>

        {/* Center: Global Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-700">
          <Link
            href="/"
            className={`rounded-lg px-3 py-1.5 transition hover:bg-slate-100 ${
              pathname === '/' ? 'text-blue-900 font-semibold bg-slate-100' : ''
            }`}
          >
            {langHindi ? 'मुखपृष्ठ' : 'Home'}
          </Link>
          <Link
            href="/challenges"
            className={`rounded-lg px-3 py-1.5 transition hover:bg-slate-100 ${
              pathname.startsWith('/challenges') ? 'text-blue-900 font-semibold bg-slate-100' : ''
            }`}
          >
            {langHindi ? 'चुनौतियाँ' : 'Challenges'}
          </Link>
          <Link
            href="/citizen/leaderboard"
            className={`rounded-lg px-3 py-1.5 transition hover:bg-slate-100 ${
              pathname.includes('leaderboard') ? 'text-blue-900 font-semibold bg-slate-100' : ''
            }`}
          >
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4 text-amber-500" />
              {langHindi ? 'लीडरबोर्ड' : 'Leaderboard'}
            </span>
          </Link>
          <Link
            href="/citizen/report"
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 hover:shadow-sm"
          >
            + {langHindi ? 'चुनौती दर्ज करें' : 'Report Challenge'}
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* 5-Min Guided Tour Button */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:from-amber-600 hover:to-orange-600 cursor-pointer animate-pulse"
              title="Step-by-step judge walkthrough"
            >
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline">5-Min Demo Tour</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recent Updates & Alerts
                  </span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                    Live
                  </span>
                </div>
                <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto text-xs">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2 hover:bg-slate-50 rounded px-1 transition">
                      <div className="font-semibold text-slate-800">{n.title}</div>
                      <div className="text-slate-500 line-clamp-2 text-[11px] mt-0.5">{n.message}</div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Switcher Banner */}
      <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
              Switch Role View:
            </span>
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg">
              <Link
                href="/citizen"
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  currentRole === 'citizen'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-blue-600" />
                <span>Citizen</span>
              </Link>

              <Link
                href="/government"
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  currentRole === 'government'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-amber-600" />
                <span>Government</span>
              </Link>

              <Link
                href="/university"
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  currentRole === 'university'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                <span>University</span>
              </Link>

              <Link
                href="/startup"
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  currentRole === 'startup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                <span>Startup / Industry</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Dumka Water Pilot Active
            </span>
            <span>•</span>
            <span className="text-slate-600">22 Jharkhand Universities Onboarded</span>
          </div>
        </div>
      </div>
    </header>
  );
}

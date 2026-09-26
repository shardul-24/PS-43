'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge } from '@/types';

export default function CitizenDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'supported' | 'following'>('my');

  useEffect(() => {
    fetch('/api/challenges?status=All')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setChallenges(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const myChallenges = challenges.filter(
    (c) => c.submittedBy.id === 'USR-CIT-01' || c.id === 'CH-1024'
  );
  const supportedChallenges = challenges.filter((c) => c.id === 'CH-1025' || c.id === 'CH-1026');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Citizen Profile & Impact Score Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl sm:text-2xl shadow-md">
              RT
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Rameshwar Tudu</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Civic Innovator
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Shikaripara, Dumka
                </span>
                <span>•</span>
                <span>Member since July 2026</span>
              </p>
              <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Link
                  href="/citizen/report"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition text-center"
                >
                  + Report a New Challenge
                </Link>
                <Link
                  href="/citizen/leaderboard"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 text-center"
                >
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Rank #1 in Dumka</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Citizen Impact Score Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 w-full lg:w-80">
            <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Citizen Impact Score
                </span>
                <div className="text-3xl font-black text-slate-900">842</div>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700">
                Top 1% in Jharkhand
              </span>
            </div>

            {/* Score Breakdown */}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Verified Reports (14)</span>
                <span className="font-semibold text-slate-900">+180</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Community Endorsements</span>
                <span className="font-semibold text-slate-900">+220</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>High Quality Evidence</span>
                <span className="font-semibold text-slate-900">+120</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Resolved Outcome Impact</span>
                <span className="font-semibold text-emerald-600">+150</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Validation Engagement</span>
                <span className="font-semibold text-slate-900">+72</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 border-b-2 px-3 transition cursor-pointer ${
            activeTab === 'my'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Challenges ({myChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('supported')}
          className={`pb-3 border-b-2 px-3 transition cursor-pointer ${
            activeTab === 'supported'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Supported Issues ({supportedChallenges.length})
        </button>
      </div>

      {/* Challenge Cards List */}
      <div className="space-y-4">
        {activeTab === 'my' &&
          myChallenges.map((ch) => (
            <div
              key={ch.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{ch.id}</span>
                  <StatusBadge status={ch.status} />
                  <PriorityBadge level={ch.priority.level} score={ch.priority.score} />
                </div>
                <span className="text-xs text-slate-400">
                  Reported on {new Date(ch.submittedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3">
                <Link
                  href={`/challenges/${ch.id}`}
                  className="text-lg font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  {ch.title}
                </Link>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ch.description}</p>
              </div>

              {/* Progress Milestones Strip */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Users className="h-4 w-4 text-blue-600" />
                    {ch.communitySupport.supportersCount + ch.communitySupport.originalReportsCount} Citizens Backing
                  </span>
                  {ch.assignedUniversityName && (
                    <span className="text-emerald-700 font-medium">
                      Matched to: <strong>{ch.assignedUniversityName}</strong>
                    </span>
                  )}
                </div>

                <Link
                  href={`/challenges/${ch.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <span>Track Full Lifecycle</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}

        {activeTab === 'supported' &&
          supportedChallenges.map((ch) => (
            <div
              key={ch.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-500">{ch.id}</span>
                <StatusBadge status={ch.status} />
                <span className="text-xs text-slate-500">{ch.district} District</span>
              </div>
              <Link href={`/challenges/${ch.id}`} className="text-base font-bold text-slate-900 hover:text-blue-600">
                {ch.title}
              </Link>
              <p className="text-xs text-slate-600 mt-1">{ch.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

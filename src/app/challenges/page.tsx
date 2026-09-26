'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, Users, ArrowRight, Sparkles, Droplets } from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/data/seedData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge } from '@/types';

export default function ChallengesExplorer() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [district, setDistrict] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');

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

  const filtered = challenges.filter((c) => {
    if (district !== 'All' && c.district.toLowerCase() !== district.toLowerCase()) return false;
    if (category !== 'All' && c.category !== category) return false;
    if (priority !== 'All' && c.priority.level !== priority) return false;
    if (status !== 'All' && c.status !== status) return false;
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.district.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Open Civic Innovation Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Explore Societal Challenges Across Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real community challenges submitted by citizens, verified by government, and being solved by Jharkhand universities.
          </p>
        </div>

        <Link
          href="/citizen/report"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs shrink-0 text-center"
        >
          + Report a New Challenge
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by challenge ID, keyword, village, or district (e.g. Dumka, water, cold storage)..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-hidden"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Mining Impact & Remediation">Mining Impact & Remediation</option>
            <option value="Energy">Energy</option>
            <option value="Rural Livelihoods">Rural Livelihoods</option>
            <option value="Infrastructure & Connectivity">Infrastructure & Connectivity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Accessibility & Disability">Accessibility & Disability</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Routed">Routed</option>
            <option value="Accepted">Accepted</option>
            <option value="Solution Development">Solution Development</option>
            <option value="Pilot">Pilot</option>
            <option value="Implemented">Implemented</option>
            <option value="Impact Measured">Impact Measured</option>
          </select>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing {filtered.length} societal challenges</span>
        </div>

        {filtered.map((ch) => (
          <div
            key={ch.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">{ch.id}</span>
                <StatusBadge status={ch.status} size="sm" />
                <PriorityBadge level={ch.priority.level} score={ch.priority.score} showIcon={false} />
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{ch.district} ({ch.block})</span>
                </span>
              </div>

              <span className="text-[11px] text-slate-400">
                {new Date(ch.submittedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-2.5">
              <Link
                href={`/challenges/${ch.id}`}
                className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition leading-snug"
              >
                {ch.title}
              </Link>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {ch.description}
              </p>
            </div>

            {/* Bottom info bar */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-50 text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-600 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <strong>
                    {ch.communitySupport.supportersCount + ch.communitySupport.originalReportsCount}
                  </strong>{' '}
                  citizens backing
                </span>
                {ch.assignedUniversityName && (
                  <span className="text-emerald-700 font-medium truncate">
                    University: <strong>{ch.assignedUniversityName}</strong>
                  </span>
                )}
              </div>

              <Link
                href={`/challenges/${ch.id}`}
                className="flex items-center gap-1 text-xs font-bold text-[#0B192C] hover:text-blue-700 pt-1 sm:pt-0"
              >
                <span>View Full Challenge Journey</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

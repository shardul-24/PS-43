'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Filter, Users, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/data/seedData';
import { LeaderboardUser } from '@/types';

export default function CitizenLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [timeframe, setTimeframe] = useState<'all' | 'monthly'>('all');

  useEffect(() => {
    fetch(`/api/leaderboard?district=${selectedDistrict}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setLeaderboard(json.data);
        }
      })
      .catch(() => {});
  }, [selectedDistrict]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Civic Recognition System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Jharkhand Citizen Impact Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Honoring grassroots contributors whose verified reports and solution validations improve lives across Jharkhand.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg border border-slate-300 bg-slate-100 p-0.5">
            <button
              onClick={() => setTimeframe('all')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                timeframe === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                timeframe === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Spam Explanation Card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 mb-6 flex items-start gap-3 text-xs text-blue-900">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Anti-Spam Scoring Policy:</span>
          <span>
            Unlike grievance portals, Samadhan Sangam does <strong>not</strong> award score based on raw quantity of complaints. Points are exclusively earned from <strong>government-verified reports (+180)</strong>, <strong>corroborated community endorsements (+220)</strong>, <strong>high-fidelity evidence (+120)</strong>, and <strong>successful societal outcomes (+150)</strong>.
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Citizen Contributor</th>
                <th className="py-3 px-4 font-bold">District</th>
                <th className="py-3 px-4 font-bold text-center">Verified Reports</th>
                <th className="py-3 px-4 font-bold text-center">Citizens Benefited</th>
                <th className="py-3 px-4 font-bold text-right">Impact Score</th>
                <th className="py-3 px-4 font-bold text-center">Rank Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaderboard.map((u, idx) => (
                <tr
                  key={u.userId}
                  className={`hover:bg-slate-50 transition ${
                    u.userId === 'USR-CIT-01' ? 'bg-emerald-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700/20 text-amber-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span>{u.name}</span>
                    {u.userId === 'USR-CIT-01' && (
                      <span className="rounded bg-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-emerald-900">
                        You (Demo)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{u.district}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">
                    {u.verifiedReportsCount}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    {u.peopleSupportedCount.toLocaleString()}+
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-base text-slate-900">
                    {u.impactScore}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        u.rankBadge === 'Civic Innovator'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : u.rankBadge === 'Impact Leader'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {u.rankBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

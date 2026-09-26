'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  GraduationCap,
  Users,
  Search,
  Filter,
  Eye,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';
import { JharkhandMap } from '@/components/map/JharkhandMap';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge, UniversityMatch, AuditLogEntry } from '@/types';

export default function GovernmentCommandCenter() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'map' | 'routing' | 'audit'>('queue');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchAllData = () => {
    fetch('/api/challenges?status=All')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setChallenges(json.data);
          if (!selectedChallenge && json.data.length > 0) {
            const dumkaCh = json.data.find((c: Challenge) => c.id === 'CH-1024') || json.data[0];
            setSelectedChallenge(dumkaCh);
          }
        }
      })
      .catch(() => {});

    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAnalytics(json.data);
      })
      .catch(() => {});

    fetch('/api/audit')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAuditLogs(json.data.slice(0, 15));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Action: Verify Challenge
  const handleVerify = async (challengeId: string) => {
    setActionInProgress(challengeId);
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Verified',
          assignedDepartment: 'Drinking Water & Sanitation Department (DWSD), Govt of Jharkhand',
          actor: {
            role: 'government',
            name: 'Dr. Arvind Sinha (Director, Higher & Tech Ed)',
            actionDescription: 'Challenge verified following ground validation by District Collectorate.',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        if (selectedChallenge?.id === challengeId) {
          setSelectedChallenge(data.data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionInProgress(null);
    }
  };

  // Action: Route Challenge to University (Jharkhand-First)
  const handleRouteToUniversity = async (challengeId: string, univId: string, univName: string) => {
    setActionInProgress(challengeId);
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Routed',
          assignedUniversityId: univId,
          assignedUniversityName: univName,
          actor: {
            role: 'government',
            name: 'Dr. Arvind Sinha (Director, Higher & Tech Ed)',
            actionDescription: `Jharkhand-First routing executed: Routed with highest institutional match to ${univName}.`,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        if (selectedChallenge?.id === challengeId) {
          setSelectedChallenge(data.data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (filterPriority !== 'All' && c.priority.level !== filterPriority) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Command Center Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Live Governance Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Department of Higher & Technical Education
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Government of Jharkhand • Societal Innovation Verification & Institutional Routing Portal
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verification Queue ({challenges.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              activeTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            District Map
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              activeTab === 'routing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jharkhand-First Routing
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log Trail
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Logged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics?.kpis?.totalChallenges || 58}</div>
          <span className="text-[10px] text-slate-500">Grassroots issues</span>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
          <div className="text-2xl font-black text-amber-900 mt-1">{analytics?.kpis?.pendingVerification || 8}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Requires verification</span>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Govt Verified</span>
          <div className="text-2xl font-black text-emerald-900 mt-1">{analytics?.kpis?.verified || 41}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Field corroborated</span>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Critical Priority</span>
          <div className="text-2xl font-black text-rose-900 mt-1">{analytics?.kpis?.highPriority || 14}</div>
          <span className="text-[10px] text-rose-700 font-semibold">Score &gt; 80</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">University Pilots</span>
          <div className="text-2xl font-black text-blue-900 mt-1">{analytics?.kpis?.inProgress || 19}</div>
          <span className="text-[10px] text-blue-700 font-semibold">Active R&D squads</span>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Solutions Deployed</span>
          <div className="text-2xl font-black text-purple-900 mt-1">{analytics?.kpis?.solutionsDeployed || 8}</div>
          <span className="text-[10px] text-purple-700 font-semibold">48,500+ Beneficiaries</span>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'map' && (
        <div className="mb-8">
          <JharkhandMap />
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table of Challenges */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
            {/* Table Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 bg-slate-50/50 text-xs">
              <span className="font-bold text-slate-800">Verification & Routing Queue</span>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted (Pending)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Routed">Routed</option>
                  <option value="Accepted">Accepted</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium"
                >
                  <option value="All">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {/* Queue Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Challenge Title</th>
                    <th className="py-3 px-3">District</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Backing</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredChallenges.map((ch) => {
                    const isSelected = selectedChallenge?.id === ch.id;
                    return (
                      <tr
                        key={ch.id}
                        onClick={() => setSelectedChallenge(ch)}
                        className={`hover:bg-slate-50 transition cursor-pointer ${
                          isSelected ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{ch.id}</td>
                        <td className="py-3 px-3 max-w-[220px]">
                          <div className="font-bold text-slate-900 truncate">{ch.title}</div>
                          <div className="text-[10px] text-slate-500">{ch.category}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{ch.district}</td>
                        <td className="py-3 px-3">
                          <PriorityBadge level={ch.priority.level} score={ch.priority.score} showIcon={false} />
                        </td>
                        <td className="py-3 px-3 font-medium">
                          {ch.communitySupport.supportersCount + ch.communitySupport.originalReportsCount} citizens
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={ch.status} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {ch.status === 'Submitted' || ch.status === 'Under Review' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(ch.id);
                              }}
                              disabled={actionInProgress === ch.id}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                            >
                              Verify
                            </button>
                          ) : ch.status === 'Verified' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChallenge(ch);
                                setActiveTab('routing');
                              }}
                              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 shadow-xs"
                            >
                              Route HEI →
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Active</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Detail Inspection Panel */}
          <div className="lg:col-span-4 space-y-4">
            {selectedChallenge ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{selectedChallenge.id}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedChallenge.title}</h3>
                  </div>
                  <StatusBadge status={selectedChallenge.status} />
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedChallenge.description}
                </div>

                {/* Explainable Priority Breakdown */}
                <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-orange-950">
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-orange-600" />
                      Priority Engine Breakdown
                    </span>
                    <span className="font-mono text-sm">{selectedChallenge.priority.score}/100</span>
                  </div>
                  <div className="space-y-1 text-slate-700 text-[11px]">
                    {selectedChallenge.priority.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-orange-600 mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Corroboration */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-center">
                    <span className="block text-xl font-bold text-slate-900">
                      {selectedChallenge.impactQuestions.peopleAffectedApprox}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Citizens Affected</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-center">
                    <span className="block text-xl font-bold text-blue-600">
                      {selectedChallenge.communitySupport.supportersCount + selectedChallenge.communitySupport.originalReportsCount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Community Backers</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  {selectedChallenge.status === 'Submitted' || selectedChallenge.status === 'Under Review' ? (
                    <button
                      onClick={() => handleVerify(selectedChallenge.id)}
                      disabled={actionInProgress === selectedChallenge.id}
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer text-center"
                    >
                      ✓ Formally Verify Challenge
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('routing')}
                      className="w-full rounded-xl bg-[#0B192C] py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62] shadow-xs transition cursor-pointer text-center"
                    >
                      Inspect Jharkhand-First University Matches →
                    </button>
                  )}

                  <Link
                    href={`/challenges/${selectedChallenge.id}`}
                    className="w-full text-center rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View Public Challenge Page
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
                Select a challenge from the queue to inspect details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* JHARKHAND-FIRST UNIVERSITY ROUTING TAB */}
      {activeTab === 'routing' && selectedChallenge && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800">
                  Jharkhand-First Algorithm
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">{selectedChallenge.id}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedChallenge.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Sector: <strong>{selectedChallenge.category}</strong> • District: <strong>{selectedChallenge.district}</strong>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('queue')}
              className="text-xs font-semibold text-slate-600 hover:underline"
            >
              ← Back to Queue
            </button>
          </div>

          {/* Institutional Matches List */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Ranked Higher Education Institutions (HEIs)
            </span>

            {selectedChallenge.matchedUniversities && selectedChallenge.matchedUniversities.length > 0 ? (
              selectedChallenge.matchedUniversities.map((match, idx) => (
                <div
                  key={match.universityId}
                  className={`rounded-xl border p-5 transition ${
                    idx === 0
                      ? 'border-2 border-emerald-500 bg-emerald-50/30 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B192C] text-white font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{match.universityName}</h4>
                          {match.isJharkhand && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              Tier 1 Jharkhand HEI
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">Campus in {match.district}, Jharkhand</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-600">{match.overallMatchScore}%</div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Match Affinity</span>
                      </div>

                      <button
                        onClick={() =>
                          handleRouteToUniversity(selectedChallenge.id, match.universityId, match.universityName)
                        }
                        disabled={actionInProgress === selectedChallenge.id || selectedChallenge.assignedUniversityId === match.universityId}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                          selectedChallenge.assignedUniversityId === match.universityId
                            ? 'bg-teal-700 text-white cursor-default'
                            : 'bg-[#0B192C] text-white hover:bg-[#1E3E62]'
                        }`}
                      >
                        {selectedChallenge.assignedUniversityId === match.universityId
                          ? 'Routed Successfully ✓'
                          : `Route to ${match.universityName.split(',')[0]}`}
                      </button>
                    </div>
                  </div>

                  {/* Explainable Match Factors Breakdown */}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dept Fit (30%)</span>
                      <span className="font-bold text-slate-800">{match.breakdown.departmentExpertise}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Faculty (25%)</span>
                      <span className="font-bold text-slate-800">{match.breakdown.facultyExpertise}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Research (20%)</span>
                      <span className="font-bold text-slate-800">{match.breakdown.researchCapability}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Labs (10%)</span>
                      <span className="font-bold text-slate-800">{match.breakdown.labFacilities}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Geo Proximity (4%)</span>
                      <span className="font-bold text-slate-800">{match.breakdown.geographicRelevance}%</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 block text-[10px]">Tier 1 State (+6%)</span>
                      <span className="font-bold text-emerald-800">+{match.breakdown.tierPriority}%</span>
                    </div>
                  </div>

                  {/* Bulleted Reasons */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    {match.reasons.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic">No university matches calculated yet.</div>
            )}
          </div>
        </div>
      )}

      {/* AUDIT LOG TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              State Governance Audit Trail (Immutable Log)
            </h3>
            <span className="text-xs text-slate-500">Every administrative action is timestamped</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">{log.challengeId}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-500 font-medium">• Actor: {log.actorName}</span>
                  </div>
                  <p className="text-slate-700 mt-1 font-normal">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

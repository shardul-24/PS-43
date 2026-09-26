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
  X,
  Globe,
  MapPin,
  Clock,
  Image as ImageIcon,
  Check,
  CheckSquare,
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

  // Verification & University Assignment Modal State
  const [reviewingChallenge, setReviewingChallenge] = useState<Challenge | null>(null);
  const [verificationStep, setVerificationStep] = useState<'review' | 'assign'>('review');
  const [rankedUniversities, setRankedUniversities] = useState<UniversityMatch[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<Array<{ id: string; name: string }>>([]);
  const [isAllUniversitiesSelected, setIsAllUniversitiesSelected] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccessMessage, setAssignSuccessMessage] = useState<string | null>(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

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

  // Open Verification & Assignment Modal
  const openVerificationModal = (ch: Challenge) => {
    setReviewingChallenge(ch);
    setVerificationStep('review');
    setSelectedUniversities([]);
    setIsAllUniversitiesSelected(false);
    setAssignSuccessMessage(null);

    // Load top 5 ranked universities for this issue
    if (ch.matchedUniversities && ch.matchedUniversities.length >= 5) {
      setRankedUniversities(ch.matchedUniversities.slice(0, 5));
    } else {
      setLoadingMatches(true);
      fetch(`/api/universities?challengeId=${ch.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setRankedUniversities(json.data.slice(0, 5));
          } else if (ch.matchedUniversities) {
            setRankedUniversities(ch.matchedUniversities.slice(0, 5));
          }
        })
        .catch(() => {
          if (ch.matchedUniversities) setRankedUniversities(ch.matchedUniversities.slice(0, 5));
        })
        .finally(() => setLoadingMatches(false));
    }
  };

  // Toggle individual university in multi-selection
  const toggleUniversity = (univ: { id: string; name: string }) => {
    setIsAllUniversitiesSelected(false);
    setSelectedUniversities((prev) => {
      const exists = prev.some((u) => u.id === univ.id);
      if (exists) {
        return prev.filter((u) => u.id !== univ.id);
      } else {
        return [...prev, univ];
      }
    });
  };

  // Toggle all Top 5 in one click
  const allTop5Selected =
    rankedUniversities.length > 0 &&
    rankedUniversities.every((r) => selectedUniversities.some((u) => u.id === r.universityId));

  const toggleSelectTop5 = () => {
    if (allTop5Selected) {
      setSelectedUniversities([]);
    } else {
      setIsAllUniversitiesSelected(false);
      setSelectedUniversities(
        rankedUniversities.map((r) => ({
          id: r.universityId,
          name: r.universityName,
        }))
      );
    }
  };

  // Toggle "Assign to All Universities"
  const toggleSelectAllUniversities = () => {
    if (isAllUniversitiesSelected) {
      setIsAllUniversitiesSelected(false);
    } else {
      setIsAllUniversitiesSelected(true);
      setSelectedUniversities([]);
    }
  };

  // Action: Verify & Assign Challenge to Selected Universities or All
  const handleAssignAndVerify = async (challengeId: string) => {
    setIsAssigning(true);
    try {
      let univId = '';
      let univName = '';
      let assignedList: Array<{ id: string; name: string }> = [];
      let actionDesc = '';

      if (isAllUniversitiesSelected) {
        univId = 'ALL_UNIVERSITIES';
        univName = 'All Universities (Open Statewide Challenge)';
        assignedList = [{ id: 'ALL_UNIVERSITIES', name: 'All Universities (Open Statewide Challenge)' }];
        actionDesc = 'Challenge verified and broadcasted as an Open Statewide Challenge to all accredited universities in Jharkhand.';
      } else if (selectedUniversities.length > 0) {
        univId = selectedUniversities.map((u) => u.id).join(', ');
        univName = selectedUniversities.map((u) => u.name).join('; ');
        assignedList = selectedUniversities;
        actionDesc = `Challenge verified and assigned to ${selectedUniversities.map((u) => u.name).join(', ')} based on technical background matching.`;
      } else {
        return;
      }

      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Routed',
          assignedDepartment: 'Drinking Water & Sanitation Department (DWSD), Govt of Jharkhand',
          assignedUniversityId: univId,
          assignedUniversityName: univName,
          assignedUniversities: assignedList,
          actor: {
            role: 'government',
            name: 'Dr. Arvind Sinha (Director, Higher & Tech Ed)',
            actionDescription: actionDesc,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        const displayLabel = isAllUniversitiesSelected
          ? 'All Universities (Open Statewide Challenge)'
          : selectedUniversities.length === 5
          ? 'All Top 5 Universities'
          : selectedUniversities.length > 1
          ? `${selectedUniversities.length} Universities (${selectedUniversities[0].name.split(',')[0]} + ${selectedUniversities.length - 1} more)`
          : selectedUniversities[0].name;

        setAssignSuccessMessage(`Issue verified and successfully assigned to ${displayLabel}!`);
        fetchAllData();
        setTimeout(() => {
          setAssignSuccessMessage(null);
          setReviewingChallenge(null);
          setSelectedUniversities([]);
          setIsAllUniversitiesSelected(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAssigning(false);
    }
  };

  // Fallback simple verify
  const handleVerify = async (challengeId: string) => {
    const target = challenges.find((c) => c.id === challengeId);
    if (target) {
      openVerificationModal(target);
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

        {/* Quick Tabs - Scrollable on mobile */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('queue')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verification Queue ({challenges.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            District Map
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'routing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jharkhand-First Routing
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-lg px-3 py-2 transition cursor-pointer shrink-0 ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log Trail
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-6 mb-6 sm:mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 text-center shadow-xs">
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

            {/* Mobile Card List (< sm) */}
            <div className="block sm:hidden divide-y divide-slate-100 p-2 space-y-2">
              {filteredChallenges.map((ch) => {
                const isSelected = selectedChallenge?.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChallenge(ch)}
                    className={`rounded-xl border p-3 transition cursor-pointer ${
                      isSelected ? 'border-blue-500 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-800">{ch.id}</span>
                      <div className="flex items-center gap-1.5">
                        <PriorityBadge level={ch.priority.level} score={ch.priority.score} showIcon={false} />
                        <StatusBadge status={ch.status} size="sm" />
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{ch.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{ch.district} • {ch.category}</span>
                      <span className="font-medium text-slate-700">
                        {ch.communitySupport.supportersCount + ch.communitySupport.originalReportsCount} backers
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-blue-600 font-semibold">
                        {isSelected ? '✓ Inspecting details below' : 'Tap to inspect'}
                      </span>
                      {ch.status === 'Submitted' || ch.status === 'Under Review' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openVerificationModal(ch);
                          }}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                        >
                          Verify Issue
                        </button>
                      ) : ch.status === 'Verified' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChallenge(ch);
                            setActiveTab('routing');
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                        >
                          Route HEI →
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">In Pipeline</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Queue Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto flex-1">
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
                                openVerificationModal(ch);
                              }}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                            >
                              Verify Issue
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
                      onClick={() => openVerificationModal(selectedChallenge)}
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer text-center"
                    >
                      ✓ Review & Verify Issue
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
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B192C] text-white font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 leading-snug">{match.universityName}</h4>
                          {match.isJharkhand && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                              Tier 1 Jharkhand HEI
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">Campus in {match.district}, Jharkhand</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-2 sm:gap-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 sm:hidden">Match Affinity:</span>
                        <div>
                          <div className="text-2xl font-black text-emerald-600 sm:text-right leading-none">{match.overallMatchScore}%</div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:block">Match Affinity</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleRouteToUniversity(selectedChallenge.id, match.universityId, match.universityName)
                        }
                        disabled={actionInProgress === selectedChallenge.id || selectedChallenge.assignedUniversityId === match.universityId}
                        className={`w-full sm:w-auto rounded-xl px-4 py-2.5 sm:py-2 text-xs font-bold transition shadow-xs cursor-pointer text-center ${
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
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-100">
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

      {/* VERIFICATION & UNIVERSITY ASSIGNMENT POPUP WINDOW */}
      {reviewingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md">
                  {reviewingChallenge.id}
                </span>
                <StatusBadge status={reviewingChallenge.status} />
                <PriorityBadge
                  level={reviewingChallenge.priority.level}
                  score={reviewingChallenge.priority.score}
                />
                <span className="text-xs text-slate-500 font-medium">
                  • {reviewingChallenge.district} District
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReviewingChallenge(null);
                  setSelectedUniversities([]);
                  setIsAllUniversitiesSelected(false);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close Verification Modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-100/70 px-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setVerificationStep('review')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer ${
                  verificationStep === 'review'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Review Issue & Ground Evidence
              </button>
              <button
                type="button"
                onClick={() => setVerificationStep('assign')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  verificationStep === 'assign'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>2. Assign to University</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 font-bold">
                  HEI Selection
                </span>
              </button>
            </div>

            {/* Success Alert Banner */}
            {assignSuccessMessage && (
              <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{assignSuccessMessage}</span>
              </div>
            )}

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {verificationStep === 'review' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Title & Core Metadata */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                      {reviewingChallenge.category} • Grassroots Civic Issue
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                      {reviewingChallenge.title}
                    </h2>
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {reviewingChallenge.block ? `${reviewingChallenge.block} Block, ` : ''}{reviewingChallenge.district} District, Jharkhand
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Submitted on {new Date(reviewingChallenge.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        Reported by: <strong>{reviewingChallenge.submittedBy?.name || 'Local Citizen'}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        {reviewingChallenge.communitySupport.supportersCount + reviewingChallenge.communitySupport.originalReportsCount} Community Backers
                      </span>
                    </div>
                  </div>

                  {/* Ground Truth Problem Statement */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Ground Truth Citizen Description
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {reviewingChallenge.description}
                    </p>
                  </div>

                  {/* FIELD EVIDENCE IMAGES SECTION */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-emerald-600" />
                        <span>Submitted Field Visual Evidence</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {reviewingChallenge.evidence?.length || 2} Images Attached
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      {reviewingChallenge.evidence && reviewingChallenge.evidence.length > 0 ? (
                        reviewingChallenge.evidence.map((ev, i) => (
                          <div key={ev.id || i} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
                            <img
                              src={ev.url}
                              alt={ev.caption || 'Field evidence'}
                              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                              <span className="text-[10px] font-medium block truncate">
                                {ev.caption || `Field Corroboration #${i + 1}`}
                              </span>
                              <span className="text-[9px] text-slate-300 block">
                                Photo evidence verified
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
                            <img
                              src="https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80"
                              alt="Ground water sample test site"
                              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                              <span className="text-[10px] font-medium block truncate">
                                Field Site Visual Corroboration
                              </span>
                              <span className="text-[9px] text-slate-300 block">
                                Panchayat Inspector Photo Evidence
                              </span>
                            </div>
                          </div>
                          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
                            <img
                              src="https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80"
                              alt="Village public water source"
                              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                              <span className="text-[10px] font-medium block truncate">
                                Community Water Point Inspection
                              </span>
                              <span className="text-[9px] text-slate-300 block">
                                Affected Hamlet Borewell Structure
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Field Impact Assessment Data */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
                      Ground Impact Assessment Survey
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">Citizens Affected</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 block">
                          {reviewingChallenge.impactQuestions.peopleAffectedApprox.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">Directly exposed</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">Occurrence Frequency</span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 block capitalize">
                          {reviewingChallenge.impactQuestions.frequency}
                        </span>
                        <span className="text-[10px] text-slate-400">Continuous risk</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">Immediate Health Hazard</span>
                        <span className={`text-sm sm:text-base font-bold mt-0.5 block ${
                          reviewingChallenge.impactQuestions.immediateRisk ? 'text-rose-700' : 'text-slate-800'
                        }`}>
                          {reviewingChallenge.impactQuestions.immediateRisk ? 'Critical Hazard' : 'Monitored'}
                        </span>
                        <span className="text-[10px] text-slate-400">Requires lab testing</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <span className="text-[11px] text-slate-500 block">Civic Disruption</span>
                        <span className={`text-sm sm:text-base font-bold mt-0.5 block ${
                          reviewingChallenge.impactQuestions.affectsPublicServices ? 'text-amber-700' : 'text-slate-800'
                        }`}>
                          {reviewingChallenge.impactQuestions.affectsPublicServices ? 'Public Services' : 'Local Community'}
                        </span>
                        <span className="text-[10px] text-slate-400">Over {reviewingChallenge.impactQuestions.durationMonths} months</span>
                      </div>
                    </div>
                  </div>

                  {/* Sangam AI Problem Comprehension */}
                  <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/70 to-emerald-50/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                          Sangam AI Problem Comprehension
                        </span>
                      </div>
                      <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                        {reviewingChallenge.aiAnalysis.confidence}% AI Confidence
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-2">
                      <div>
                        <span className="font-semibold text-slate-900">Domain Taxonomy: </span>
                        <span className="rounded-md bg-white/80 px-2 py-0.5 font-mono text-[11px] border border-teal-200">
                          {reviewingChallenge.category} • {reviewingChallenge.aiAnalysis.subcategory || reviewingChallenge.aiAnalysis.affectedDomain}
                        </span>
                      </div>

                      {reviewingChallenge.aiAnalysis.problemSummary && (
                        <div>
                          <span className="font-semibold text-slate-900">Problem Summary: </span>
                          <span>{reviewingChallenge.aiAnalysis.problemSummary}</span>
                        </div>
                      )}

                      {reviewingChallenge.aiAnalysis.recommendedExpertise && reviewingChallenge.aiAnalysis.recommendedExpertise.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-900">Recommended Academic Expertise: </span>
                          <span className="text-teal-900 font-medium">
                            {reviewingChallenge.aiAnalysis.recommendedExpertise.join(', ')}
                          </span>
                        </div>
                      )}

                      {reviewingChallenge.aiAnalysis.keywords && reviewingChallenge.aiAnalysis.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="font-semibold text-slate-900 text-[11px]">Keywords: </span>
                          {reviewingChallenge.aiAnalysis.keywords.map((kw, i) => (
                            <span key={i} className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-teal-800 border border-teal-100">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority Engine Breakdown */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-orange-950">
                      <span className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-600" />
                        <span>State Priority Engine Calculation</span>
                      </span>
                      <span className="font-mono text-sm">{reviewingChallenge.priority.score}/100 ({reviewingChallenge.priority.level})</span>
                    </div>
                    <div className="space-y-1 text-slate-700 text-[11px] pt-1">
                      {reviewingChallenge.priority.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-orange-600 mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ASSIGN TO UNIVERSITY (TOP 5 HEIS WITH MULTI-SELECT & SELECT ALL IN ONE CLICK, WITH ASSIGN TO ALL UNIVERSITIES AT THE END) */}
              {verificationStep === 'assign' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                      Institutional Routing Decision
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Assign Verified Issue to University Ecosystem
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Select one or multiple universities from the <strong>Top 5 HEIs</strong> matched by academic domain and laboratory capabilities, select all Top 5 in one click, or broadcast statewide to <strong>All Universities</strong> at the bottom.
                    </p>
                  </div>

                  {/* SECTION 1: TOP 5 MATCHED UNIVERSITIES */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                        <span>Top 5 Universities with Relevant Academic Background</span>
                      </span>
                      {loadingMatches && (
                        <span className="text-[11px] text-slate-400 font-medium animate-pulse">
                          Computing affinity scores...
                        </span>
                      )}
                    </div>

                    {/* QUICK ACTION / MASTER CHECKBOX: SELECT ALL TOP 5 IN ONE CLICK */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 p-3.5 sm:p-4 shadow-2xs">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={allTop5Selected}
                          onChange={toggleSelectTop5}
                          className="h-5 w-5 rounded-md border-emerald-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <CheckSquare className="h-4 w-4 text-emerald-700" />
                            <span className="text-sm font-bold text-slate-900">
                              Select Top 5 in one check box click
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Simultaneously invite all 5 matched Jharkhand institutions to formulate cross-university or squad solutions
                          </p>
                        </div>
                      </label>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-900">
                          {selectedUniversities.length} of {rankedUniversities.length} Selected
                        </span>
                        {selectedUniversities.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedUniversities([])}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                          >
                            Deselect All
                          </button>
                        )}
                      </div>
                    </div>

                    {/* TOP 5 UNIVERSITY CARDS WITH MULTI-SELECT CHECKBOXES */}
                    <div className="space-y-3 pt-1">
                      {rankedUniversities.map((match, idx) => {
                        const isSelected = selectedUniversities.some((u) => u.id === match.universityId);
                        return (
                          <div
                            key={match.universityId}
                            onClick={() =>
                              toggleUniversity({
                                id: match.universityId,
                                name: match.universityName,
                              })
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                toggleUniversity({
                                  id: match.universityId,
                                  name: match.universityName,
                                });
                              }
                            }}
                            className={`rounded-xl border p-4 transition cursor-pointer text-left select-none relative ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B192C] text-white font-bold text-xs">
                                  #{idx + 1}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                      {match.universityName}
                                    </h4>
                                    {match.isJharkhand && (
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                        Tier 1 State HEI
                                      </span>
                                    )}
                                    <span className="text-xs text-slate-400 font-medium">
                                      • Campus in {match.district}
                                    </span>
                                  </div>

                                  <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-slate-600">
                                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                                      Dept: {match.reasons[0]?.replace('Aligned department: ', '') || 'Engineering & Applied Sciences'}
                                    </span>
                                    {match.recommendedFaculty && match.recommendedFaculty.length > 0 && (
                                      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                                        Faculty Lead: {match.recommendedFaculty[0]}
                                      </span>
                                    )}
                                    {match.relevantLabs && match.relevantLabs.length > 0 && (
                                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-900 font-semibold border border-emerald-200/50">
                                        Lab: {match.relevantLabs[0]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-right">
                                  <span className="text-base font-black text-emerald-600 block leading-tight">
                                    {match.overallMatchScore}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                                    Match Affinity
                                  </span>
                                </div>

                                <div
                                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                                      : 'border-slate-300 bg-white hover:border-slate-400'
                                  }`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DIVIDER: OR BROADCAST STATEWIDE */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      OR Statewide Public Challenge
                    </span>
                  </div>

                  {/* OPTION: ASSIGN TO ALL UNIVERSITIES (KEPT AT THE END BELOW TOP 5) */}
                  <div
                    onClick={toggleSelectAllUniversities}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleSelectAllUniversities();
                      }
                    }}
                    className={`rounded-2xl border-2 p-4 sm:p-5 transition cursor-pointer text-left select-none relative ${
                      isAllUniversitiesSelected
                        ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-500/20'
                        : 'border-purple-200 bg-gradient-to-r from-purple-50/40 via-white to-indigo-50/30 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white font-bold shadow-xs">
                          <Globe className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">
                              Assign to All Universities (Open Statewide Challenge)
                            </h4>
                            <span className="rounded-full bg-purple-100 text-purple-900 font-bold px-2.5 py-0.5 text-[10px]">
                              Open to All Institutions
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Broadcast this verified issue publicly across the entire Higher Education portal for all universities, colleges, and polytechnics in Jharkhand rather than restricting to matching disciplines. Any student squad can accept and submit innovation proposals.
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        <div
                          className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition ${
                            isAllUniversitiesSelected
                              ? 'border-purple-600 bg-purple-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white hover:border-purple-300'
                          }`}
                        >
                          {isAllUniversitiesSelected && <Check className="h-4 w-4 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              {verificationStep === 'review' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewingChallenge(null);
                      setSelectedUniversities([]);
                      setIsAllUniversitiesSelected(false);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer text-center"
                  >
                    Close Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationStep('assign')}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                  >
                    <span>Proceed to Assign to Universities →</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setVerificationStep('review')}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer text-center"
                  >
                    ← Back to Review Details
                  </button>

                  <button
                    type="button"
                    disabled={(!isAllUniversitiesSelected && selectedUniversities.length === 0) || isAssigning}
                    onClick={() => {
                      if (isAllUniversitiesSelected || selectedUniversities.length > 0) {
                        handleAssignAndVerify(reviewingChallenge.id);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0B192C] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62] shadow-md disabled:opacity-50 transition cursor-pointer text-center"
                  >
                    {isAssigning ? (
                      <>Assigning & Routing Issue...</>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>
                          {isAllUniversitiesSelected
                            ? 'Confirm & Assign to All Universities (Statewide Open)'
                            : selectedUniversities.length === 5
                            ? 'Confirm & Assign to All Top 5 Universities'
                            : selectedUniversities.length > 1
                            ? `Confirm & Assign to ${selectedUniversities.length} Selected Universities`
                            : selectedUniversities.length === 1
                            ? `Confirm & Assign to ${selectedUniversities[0].name.split(',')[0]}`
                            : 'Select University or Open Statewide to Confirm'}
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

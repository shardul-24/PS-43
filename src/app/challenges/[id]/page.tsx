'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Heart,
  Share2,
  FileText,
  Flame,
  Layers,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge } from '@/types';

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [isSupporting, setIsSupporting] = useState(false);

  useEffect(() => {
    if (!challengeId) return;
    fetch(`/api/challenges/${challengeId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setChallenge(json.data);
          setSupportCount(
            json.data.communitySupport.supportersCount +
              json.data.communitySupport.originalReportsCount
          );
        }
      })
      .catch(() => {});
  }, [challengeId]);

  const handleSupportClick = async () => {
    if (!challenge || hasSupported) return;
    setIsSupporting(true);
    try {
      const res = await fetch(`/api/challenges/${challenge.id}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'USR-CIT-01',
          userName: 'Rameshwar Tudu',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasSupported(true);
        setSupportCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSupporting(false);
    }
  };

  if (!challenge) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500">
        <Sparkles className="h-6 w-6 text-emerald-500 animate-spin mx-auto mb-2" />
        Loading challenge data...
      </div>
    );
  }

  const STAGES = [
    'Submitted',
    'Verified',
    'Routed',
    'Accepted',
    'Solution Development',
    'Pilot',
    'Implemented',
    'Impact Measured',
  ];

  const currentStageIndex = STAGES.indexOf(challenge.status);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <Link href="/challenges" className="hover:underline">
            Challenges
          </Link>
          <span>/</span>
          <span className="font-mono font-bold text-slate-800">{challenge.id}</span>
          <span>/</span>
          <span>{challenge.district}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={challenge.status} size="sm" />
          <PriorityBadge level={challenge.priority.level} score={challenge.priority.score} />
        </div>
      </div>

      {/* Main Title & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Col (8 spans): Details, Evidence, AI analysis */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
              {challenge.title}
            </h1>
            <p className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                {challenge.villageOrCity}, {challenge.district}
              </span>
              <span>•</span>
              <span>By {challenge.submittedBy.name}</span>
              <span>•</span>
              <span>{new Date(challenge.submittedAt).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Quick Support Callout (Mobile only for quick access) */}
          <div className="block lg:hidden rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-950 font-bold">Community Backing</span>
              <span className="font-mono text-xs font-bold text-emerald-800">
                {supportCount} citizens
              </span>
            </div>
            <button
              onClick={handleSupportClick}
              disabled={hasSupported || isSupporting}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                hasSupported
                  ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              }`}
            >
              <Heart className={`h-4 w-4 ${hasSupported ? 'fill-emerald-800' : ''}`} />
              <span>{hasSupported ? 'Supported ✓' : 'Support this Challenge (+220 pts)'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Citizen Field Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Evidence Photos */}
          {challenge.evidence && challenge.evidence.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Field Evidence ({challenge.evidence.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenge.evidence.map((ev) => (
                  <div key={ev.id} className="rounded-xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.url}
                      alt={ev.caption || 'Evidence photo'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 bg-slate-50 text-xs">
                      <div className="font-semibold text-slate-800">{ev.caption}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Uploaded on {new Date(ev.uploadedAt).toLocaleDateString()} by {ev.uploadedBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Problem Analysis Card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                  Sangam AI Problem Comprehension
                </h3>
              </div>
              <span className="rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-900">
                {challenge.aiAnalysis.confidence}% Match Confidence
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-emerald-100 leading-relaxed">
              {challenge.aiAnalysis.problemSummary}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Affected Sector</span>
                <span className="font-bold text-slate-900">{challenge.aiAnalysis.category}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Estimated Priority</span>
                <span className="font-bold text-orange-600">{challenge.aiAnalysis.estimatedPriority}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Estimated Population</span>
                <span className="font-bold text-slate-900">{challenge.impactQuestions.peopleAffectedApprox} people</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Recommended Academic & Engineering Expertise:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {challenge.aiAnalysis.recommendedExpertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900 border border-emerald-200"
                  >
                    ✓ {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* End-to-End Governance Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              End-to-End Resolution Pipeline
            </h3>

            <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 ml-2 text-xs">
              {STAGES.map((stg, idx) => {
                const isPassed = currentStageIndex >= idx || (currentStageIndex === -1 && idx <= 1);
                return (
                  <div key={stg} className="relative">
                    <div
                      className={`absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full border-2 bg-white ${
                        isPassed ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                      }`}
                    />
                    <div className={`font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {stg}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col (4 spans): Community Count, Actions, University Match */}
        <div className="lg:col-span-4 space-y-6">
          {/* Community Support & Corroboration Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-900">{supportCount}</span>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                People reported or supported this issue
              </p>
            </div>

            {/* Support Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Original Field Reports</span>
                <span className="font-bold text-slate-800">
                  {challenge.communitySupport.originalReportsCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Community Supporters</span>
                <span className="font-bold text-slate-800">
                  {challenge.communitySupport.supportersCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Evidence Contributors</span>
                <span className="font-bold text-slate-800">
                  {challenge.communitySupport.evidenceContributorsCount}
                </span>
              </div>
            </div>

            {/* Support Button */}
            <button
              onClick={handleSupportClick}
              disabled={hasSupported || isSupporting}
              className={`w-full rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                hasSupported
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              }`}
            >
              <Heart className={`h-4 w-4 ${hasSupported ? 'fill-emerald-700' : ''}`} />
              <span>{hasSupported ? 'You Supported this Challenge ✓' : 'Support this Challenge (+220 pts)'}</span>
            </button>
          </div>

          {/* Assigned / Matched University Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jharkhand-First University Match
            </h4>

            {challenge.matchedUniversities && challenge.matchedUniversities.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">
                    {challenge.matchedUniversities[0].universityName}
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    {challenge.matchedUniversities[0].overallMatchScore}% Match
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tier 1 Jharkhand HEI • {challenge.matchedUniversities[0].district}
                </p>
                <div className="text-xs text-slate-600 pt-1 space-y-1">
                  {challenge.matchedUniversities[0].reasons.slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Pending university matching calculation.</p>
            )}

            {challenge.projectId && (
              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/projects/${challenge.projectId}`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0B192C] py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62] transition"
                >
                  <span>Inspect Active Solution Project ({challenge.projectId})</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

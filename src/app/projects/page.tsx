'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Layers,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { JHARKHAND_DISTRICTS } from '@/data/seedData';
import { Project } from '@/types';

export default function ProjectsExplorer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedDistrict !== 'All' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedStage !== 'All' && p.stage !== selectedStage) {
      return false;
    }
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.universityName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.district.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalBeneficiaries = projects.reduce(
    (sum, p) => sum + (p.impactMetrics?.peopleBenefited || 0),
    0
  );
  const totalFunding = projects.reduce(
    (sum, p) => sum + (p.proposal?.estimatedCostInr || 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Jharkhand Academic Civic Tech Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Applied University R&D & Pilot Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-world prototypes, field deployments, and multidisciplinary solutions developed by Jharkhand HEIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/university"
            className="w-full sm:w-auto text-center rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition"
          >
            + Form New University Team
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 mb-6 sm:mb-8 text-center text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">Active R&D Projects</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">{projects.length}</span>
          <span className="text-[10px] text-slate-500">Across 22 HEIs</span>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-2xs">
          <span className="text-emerald-700 font-bold block text-[10px] uppercase">Total Grant Allocation</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-0.5 block">
            ₹{(totalFunding / 100000).toFixed(1)} Lakhs
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">State & Industry Grants</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 shadow-2xs">
          <span className="text-blue-700 font-bold block text-[10px] uppercase">Student Engineers</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-900 mt-0.5 block">
            {projects.reduce((acc, p) => acc + (p.students?.length || 4), 0)}
          </span>
          <span className="text-[10px] text-blue-700 font-medium">Multidisciplinary squads</span>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 shadow-2xs">
          <span className="text-purple-700 font-bold block text-[10px] uppercase">Citizens Impacted</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-900 mt-0.5 block">
            {totalBeneficiaries > 0 ? totalBeneficiaries.toLocaleString() : '1,240'}+
          </span>
          <span className="text-[10px] text-purple-700 font-medium">Verified field reach</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, ID (e.g. PRJ-301), university (e.g. BIT Mesra), or district..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/60 pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} District
              </option>
            ))}
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 font-medium text-slate-700"
          >
            <option value="All">All Project Stages</option>
            <option value="Proposal">Proposal Submitted</option>
            <option value="R&D">R&D & Lab Prototyping</option>
            <option value="Prototype">Benchtop Prototype Active</option>
            <option value="Testing">Testing & Certification</option>
            <option value="Pilot">Field Pilot Deployment</option>
            <option value="Scale">Commercial Scaling</option>
          </select>
        </div>
      </div>

      {/* Project Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing {filteredProjects.length} innovation projects</span>
          <Link href="/challenges" className="text-emerald-700 hover:underline font-semibold">
            Browse Grassroots Challenges →
          </Link>
        </div>

        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{proj.id}</span>
                  <StatusBadge status={proj.stage} size="sm" />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{proj.district} District</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institution: <strong>{proj.universityName}</strong> • Faculty Lead:{' '}
                  <strong>{proj.facultyMentor?.name}</strong> ({proj.facultyMentor?.department})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <Link
                  href={`/challenges/${proj.challengeId}`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center"
                >
                  View Challenge ({proj.challengeId})
                </Link>
                <Link
                  href={`/projects/${proj.id}`}
                  className="rounded-xl bg-[#0B192C] px-4 py-2 text-xs font-bold text-white hover:bg-[#1E3E62] transition shadow-xs flex items-center justify-center gap-1"
                >
                  <span>Inspect Project</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* Team and Budget Strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span>
                Engineers: <strong>{proj.students?.length || 4} Student Researchers</strong>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                Estimated Budget: <strong>₹{proj.proposal?.estimatedCostInr?.toLocaleString() || '2,85,000'}</strong>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                Timeline: <strong>{proj.proposal?.timelineMonths || 4} Months</strong>
              </span>
              {proj.collaborations && proj.collaborations.length > 0 && (
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-900 font-bold">
                  Industry Partner: {proj.collaborations[0].startupName}
                </span>
              )}
            </div>

            {/* Milestones Preview */}
            {proj.milestones && proj.milestones.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Milestone Progress ({proj.milestones.length} Stages)
                  </span>
                  <Link
                    href={`/projects/${proj.id}`}
                    className="text-emerald-700 font-bold text-[11px] hover:underline"
                  >
                    View 9-Stage Tracker →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {proj.milestones.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 truncate text-[11px]">{m.title}</span>
                        <span className="font-mono font-bold text-emerald-700 text-[10px]">
                          {m.progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${m.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

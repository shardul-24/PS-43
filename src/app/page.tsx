'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  Droplets,
  HeartPulse,
  Sprout,
  Trash2,
  TreePine,
  Zap,
  HardHat,
  Accessibility,
  Search,
  ChevronRight,
  Flame,
  Award,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { JharkhandMap } from '@/components/map/JharkhandMap';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Challenge } from '@/types';

export default function LandingPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAnalytics(json.data);
      })
      .catch(() => {});

    fetch('/api/challenges?status=All')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setRecentChallenges(json.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { name: 'Water Resources', icon: Droplets, color: 'text-blue-600 bg-blue-50 border-blue-200', count: 18 },
    { name: 'Healthcare', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200', count: 12 },
    { name: 'Agriculture', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', count: 14 },
    { name: 'Mining Impact & Remediation', icon: HardHat, color: 'text-zinc-700 bg-zinc-100 border-zinc-200', count: 9 },
    { name: 'Energy', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200', count: 8 },
    { name: 'Environment & Forestry', icon: TreePine, color: 'text-green-600 bg-green-50 border-green-200', count: 7 },
    { name: 'Accessibility & Disability', icon: Accessibility, color: 'text-purple-600 bg-purple-50 border-purple-200', count: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#10233B] to-[#0B192C] text-white py-12 sm:py-16 lg:py-24">
        {/* Background Subtle Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Smart India Hackathon 2026 • PS26043</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              From Community Problems to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Real-World Solutions
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed px-1 sm:px-0">
              A collaborative platform connecting citizens, universities, startups and government to solve societal challenges across Jharkhand.
            </p>

            {/* CTAs */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <Link
                href="/citizen/report"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-[#0B192C] shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition"
              >
                <span>Report a Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/challenges"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm border border-white/20 hover:bg-white/15 transition"
              >
                <span>Explore Challenges</span>
              </Link>
            </div>

            {/* Quick Demo Switcher Pill */}
            <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="text-slate-400">Quick Login:</span>
              <Link href="/citizen" className="text-emerald-400 hover:underline font-medium">Citizen</Link>
              <span>•</span>
              <Link href="/government" className="text-amber-400 hover:underline font-medium">Government</Link>
              <span>•</span>
              <Link href="/university" className="text-teal-400 hover:underline font-medium">University</Link>
              <span>•</span>
              <Link href="/startup" className="text-purple-400 hover:underline font-medium">Startup Hub</Link>
            </div>
          </div>

          {/* Live Seeded Metrics Counter Strip */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-7 border-t border-white/10 pt-6 sm:pt-8">
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-white">58</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Challenges Reported</div>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">41</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Challenges Verified</div>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-teal-300">22</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Universities Active</div>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-purple-300">16</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Industry Partners</div>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-amber-300">19</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Projects In Progress</div>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5 sm:p-3 text-center border border-white/5">
              <div className="text-xl sm:text-3xl font-black text-cyan-400">8</div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">Solutions Deployed</div>
            </div>
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl bg-emerald-500/10 p-2.5 sm:p-3 text-center border border-emerald-500/20">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">48.5K+</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-emerald-200 mt-0.5">Citizens Benefited</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works: The 6-Stage Journey */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              End-to-End Civic Innovation Lifecycle
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              How Grassroots Problems Become Real Solutions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every societal issue submitted on Samadhan Sangam travels through a rigorous, transparent collaborative pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: '01', title: 'Report', role: 'Citizen', desc: 'Natural language report with geotagged photo, video, and community impact questionnaire.' },
              { num: '02', title: 'Understand', role: 'Sangam AI', desc: 'NLP categorizes domain, checks for duplicates, and calculates explainable priority score.' },
              { num: '03', title: 'Verify & Match', role: 'Government', desc: 'District officers verify facts and trigger Jharkhand-First HEI routing algorithm.' },
              { num: '04', title: 'Form Team', role: 'University', desc: 'Tier-1 Jharkhand institution accepts and forms faculty + multi-dept student squad.' },
              { num: '05', title: 'Collaborate', role: 'Startup / MSME', desc: 'Industry partners pledge seed funding, lab access, sensor prototypes, and pilot resources.' },
              { num: '06', title: 'Measure Impact', role: 'All Stakeholders', desc: 'Panchayat validates post-intervention improvement, restoring safe water, health, and services.' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:bg-white hover:shadow-md hover:border-emerald-300 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-emerald-600 transition">
                    {step.num}
                  </span>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {step.role}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-3">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Explore Societal Challenges & Spotlight */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Grassroots Innovation Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Explore Societal Challenges
              </h2>
            </div>
            <Link
              href="/challenges"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All 58 Challenges</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/challenges?category=${encodeURIComponent(cat.name)}`}
                  className="rounded-xl border border-slate-200 bg-white p-3 hover:border-emerald-500 hover:shadow-xs transition group text-left"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 border ${cat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{cat.count} logged</div>
                </Link>
              );
            })}
          </div>

          {/* Highlight Demo Challenge: CH-1024 Dumka Water Contamination */}
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-white p-4 sm:p-6 shadow-md relative overflow-hidden mb-8">
            <div className="sm:absolute sm:top-0 sm:right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-white px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-none sm:rounded-bl-xl uppercase tracking-wider flex items-center gap-1.5 w-fit mb-3 sm:mb-0">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Featured SIH 2026 Demo Case</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">CH-1024</span>
                <StatusBadge status="Solution Development" />
                <PriorityBadge level="HIGH" score={88} />
                <span className="text-xs text-slate-500">• Dumka (Shikaripara)</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                Drinking water contamination affecting villages near Dumka
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Runoff from unlined stone-crusher operations washed into the local aquifer, causing foul metallic odor and fluorosis symptoms in over 1,240 villagers. Routed to BIT Mesra with JalRakshak IoT Technologies support.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Users className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>127 citizens supporting</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>BIT Mesra (94% match)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Briefcase className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>JalRakshak IoT (Grant)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <Link
                  href="/challenges/CH-1024"
                  className="rounded-lg bg-[#0B192C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1E3E62] transition text-center"
                >
                  Inspect Full Challenge Journey →
                </Link>
                <Link
                  href="/projects/PRJ-301"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center"
                >
                  View Active Pilot Project (PRJ-301)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Jharkhand Map Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Statewide Civic Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Jharkhand Geospatial Impact Explorer
            </h2>
          </div>
          <JharkhandMap />
        </div>
      </section>

      {/* 5. Participating Jharkhand Universities & Startups */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Tier-1 Higher Education Institutions & Industry Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Collaborative Innovation Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Empowering Jharkhand’s premier engineering and research institutions to solve ground challenges in their home state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'BIT Mesra, Ranchi', focus: 'Environmental Engineering & IoT Probes', pilots: 9, badge: 'Deemed University' },
              { name: 'IIT (ISM) Dhanbad', focus: 'Mine Drainage & Membrane Separation', pilots: 11, badge: 'Institute of National Importance' },
              { name: 'NIT Jamshedpur', focus: 'Rural Infrastructure & Modular Bridges', pilots: 8, badge: 'Institute of National Importance' },
              { name: 'BAU Kanke, Ranchi', focus: 'Solar Cold Storage & Tribal Agri-Chains', pilots: 6, badge: 'State Agricultural University' },
            ].map((univ, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {univ.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{univ.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{univ.focus}</p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                  <span className="text-emerald-700 font-bold">{univ.pilots} Active Projects</span>
                  <Link href="/university" className="text-blue-600 hover:underline">Explore</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Industry Hub Partners */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  Featured Startup & CSR Industry Collaborators
                </h4>
                <p className="text-xs text-slate-500">
                  Providing mentorship, matching seed grants, hardware prototypes, and village pilot deployment
                </p>
              </div>
              <Link href="/startup" className="text-xs font-bold text-purple-600 hover:underline">
                View All Partners →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="font-bold text-slate-900">JalRakshak IoT Technologies</div>
                <div className="text-slate-500 mt-0.5">Water Probes & Telemetry • ₹1.5L Grant Committed</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="font-bold text-slate-900">Chotanagpur Agro Innovations</div>
                <div className="text-slate-500 mt-0.5">Zero-energy Cold Rooms • Ormanjhi Pilot</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="font-bold text-slate-900">Tata Steel CSR Innovation Lab</div>
                <div className="text-slate-500 mt-0.5">Slag Filters & Rural Bridges • East Singhbhum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="bg-[#0B192C] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            “See a problem. Share it. Solve it together.”
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Join thousands of citizens, researchers, and government leaders collaborating across Jharkhand to transform everyday community struggles into scalable social innovations.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/citizen/report"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-bold text-[#0B192C] hover:bg-emerald-400 transition shadow-lg"
            >
              Report a Community Challenge
            </Link>
            <Link
              href="/government"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition"
            >
              Government Command Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

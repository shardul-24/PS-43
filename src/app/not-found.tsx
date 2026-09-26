'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Home,
  FileText,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function NotFound() {
  const PORTAL_LINKS = [
    {
      title: 'Citizen Portal',
      description: 'Report civic challenges, upvote local issues, and track resolutions in real-time.',
      href: '/citizen',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Challenges',
      description: 'Explore verified civic problems prioritized across all 24 districts of Jharkhand.',
      href: '/challenges',
      icon: FileText,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Government Dashboard',
      description: 'Review departmental routing, approve innovation budgets, and inspect ground evidence.',
      href: '/government',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'University Innovation Hub',
      description: 'Form multidisciplinary academic research teams, accept challenges, and deploy field pilots.',
      href: '/university',
      icon: GraduationCap,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      title: 'Startup & Industry Hub',
      description: 'Browse commercialization opportunities, co-develop prototypes, and apply for state grants.',
      href: '/startup',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Applied R&D Projects',
      description: 'Track academic milestone progress, lab telemetry metrics, and field deployments.',
      href: '/projects',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center space-y-6">
        {/* Badge & Illustration */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Jharkhand Sangam Smart Navigation</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Looking for a specific page or portal?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            The page or route you were looking for may be under active prototyping or has moved. Choose any of the primary role portals below to continue without interruption.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Compass className="h-4 w-4 text-slate-500" />
            <span>Browse Challenges</span>
          </Link>
        </div>

        {/* Portals Grid */}
        <div className="pt-8 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-center sm:text-left">
            Quick Navigation to Primary Platform Modules:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PORTAL_LINKS.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.title}
                  href={portal.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`inline-flex rounded-xl p-2.5 border ${portal.color} mb-3 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span>Enter Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

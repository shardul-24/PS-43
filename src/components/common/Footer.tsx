import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#0B192C] text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 pb-20 md:pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand & Gov Dept */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[#0B192C]">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>Samadhan Sangam</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI-assisted societal innovation ecosystem crowdsourcing grassroots challenges and facilitating collaborative problem solving across Jharkhand.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Department of Higher & Technical Education, Government of Jharkhand
            </div>
          </div>

          {/* Col 2: Four Roles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Role Ecosystem
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/citizen" className="hover:text-emerald-400 transition">
                  Citizen Hub & Report Wizard
                </Link>
              </li>
              <li>
                <Link href="/government" className="hover:text-emerald-400 transition">
                  Government Command Center
                </Link>
              </li>
              <li>
                <Link href="/university" className="hover:text-emerald-400 transition">
                  University Innovation Portal
                </Link>
              </li>
              <li>
                <Link href="/startup" className="hover:text-emerald-400 transition">
                  Startup & Industry Hub
                </Link>
              </li>
              <li>
                <Link href="/citizen/leaderboard" className="hover:text-emerald-400 transition">
                  Citizen Impact Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Technologies
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="text-slate-400">AI Problem Comprehension & NLP</li>
              <li className="text-slate-400">Semantic Duplicate Interception</li>
              <li className="text-slate-400">Explainable Priority Engine</li>
              <li className="text-slate-400">Jharkhand-First University Matching</li>
              <li className="text-slate-400">End-to-End Milestone Tracking</li>
              <li className="text-slate-400">Pre vs Post Impact Metrics</li>
            </ul>
          </div>

          {/* Col 4: Hackathon Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Smart India Hackathon 2026
            </h4>
            <div className="rounded-lg bg-white/5 p-3 text-xs border border-white/10 space-y-1.5">
              <div className="text-slate-300 font-semibold">Problem Statement: PS26043</div>
              <div className="text-[11px] text-slate-400">
                &ldquo;A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.&rdquo;
              </div>
              <div className="text-[10px] text-amber-300 font-medium pt-1">
                Demo Mode: Realistic Jharkhand Seed Dataset
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Department of Higher & Technical Education, Govt of Jharkhand. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-rose-500 inline fill-rose-500" /> for Smart India Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}

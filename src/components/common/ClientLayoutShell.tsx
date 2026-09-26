'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { DemoTourModal } from '@/components/common/DemoTourModal';
import { SangamAIAssistant } from '@/components/ai/SangamAIAssistant';

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header onOpenTour={() => setIsTourOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <DemoTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <SangamAIAssistant />
    </div>
  );
}

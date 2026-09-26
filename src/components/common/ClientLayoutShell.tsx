'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { DemoTourModal } from '@/components/common/DemoTourModal';
import { SangamAIAssistant } from '@/components/ai/SangamAIAssistant';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Header onOpenTour={() => setIsTourOpen(true)} onOpenAi={() => setIsAiOpen(true)} />
      <main className="flex-1 pb-28 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav
        onOpenTour={() => setIsTourOpen(true)}
        onOpenAi={() => setIsAiOpen((prev) => !prev)}
      />
      <DemoTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <SangamAIAssistant
        isOpen={isAiOpen}
        onOpen={() => setIsAiOpen(true)}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}

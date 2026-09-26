import type { Metadata } from 'next';
import './globals.css';
import { ClientLayoutShell } from '@/components/common/ClientLayoutShell';

export const metadata: Metadata = {
  title: 'Samadhan Sangam (समाधान संगम) | Jharkhand Societal Innovation Platform | SIH 2026 PS26043',
  description:
    'A collaborative digital platform connecting citizens, universities, startups and the Government of Jharkhand to turn grassroots societal challenges into measurable solutions.',
  keywords: [
    'SIH 2026',
    'PS26043',
    'Jharkhand',
    'Higher Education',
    'Societal Innovation',
    'Crowdsourcing Problems',
    'University Matching',
    'Startup Collaboration',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}

'use client';

import dynamic from 'next/dynamic';

const MonthlyReviewDashboard = dynamic(
  () => import('../components/MonthlyReviewDashboard'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <MonthlyReviewDashboard />
    </main>
  );
}
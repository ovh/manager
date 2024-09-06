import React, { Suspense } from 'react';

import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}

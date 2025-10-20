import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { DashboardProvider } from './contexts';
import './translations';

export function ObservabilityToCustomerModule() {
  return (
    <Suspense fallback={<div className="flex py-8">Loading UI components</div>}>
      <DashboardProvider
        context={{
          refreshInterval: 15,
        }}
      >
        <Outlet />
      </DashboardProvider>
    </Suspense>
  );
}

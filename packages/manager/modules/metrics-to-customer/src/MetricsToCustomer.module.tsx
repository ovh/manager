import { Suspense } from 'react';

import { Routes } from 'react-router-dom';

import { IMetricsToCustomerModule } from '@/IMetricsToCustomerModule.interface';
import { DashboardProvider } from '@/contexts';
import getMetricsToCustomerRoutes from '@/routes/routes';
import '@/public/translations';

export function MetricsToCustomerModule(
  moduleProps: Readonly<IMetricsToCustomerModule>,
) {
  const { resourceName, productType } = moduleProps;
  return (
    <Suspense fallback={<div className="flex py-8">Loading UI components</div>}>
      <DashboardProvider
        context={{
          productType,
          resourceName,
        }}
      >
        <Routes>${getMetricsToCustomerRoutes()}</Routes>
      </DashboardProvider>
    </Suspense>
  );
}

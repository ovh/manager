import { Suspense } from 'react';

import { Routes } from 'react-router-dom';

import { IObservabilityToCustomerModule } from '@/IObservabilityToCustomerModule.interface';
import { DashboardProvider } from '@/contexts';
import getObservabilityRoute from '@/routes/routes';
import '@/public/translations';

export function ObservabilityToCustomerModule(
  moduleProps: Readonly<IObservabilityToCustomerModule>,
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
        <Routes>${getObservabilityRoute()}</Routes>
      </DashboardProvider>
    </Suspense>
  );
}

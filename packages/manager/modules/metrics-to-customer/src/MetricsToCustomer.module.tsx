import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { Routes } from 'react-router-dom';

import { IMetricsToCustomerModule } from '@/IMetricsToCustomerModule.interface';

import getMetricsToCustomerRoutes from '@/routes/routes';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { DashboardProvider, MetricsToCustomerProvider } from '@/contexts';


export function MetricsToCustomerModule(
  moduleProps: Readonly<IMetricsToCustomerModule>,
) {
  
  const { t } = useTranslation(NAMESPACES.MODULE);

  const {
    resourceName,
    productType,
    resourceURN,
    regions,
    enableConfigurationManagement = false,
  } = moduleProps;
  return (
    <Suspense fallback={<div className="flex py-8">{t('loading_metrics_module')}</div>}>
      <MetricsToCustomerProvider
        context={{
          productType,
          resourceName,
          resourceURN,
          regions,
          enableConfigurationManagement,
        }}>
        <DashboardProvider>
          <Routes>${getMetricsToCustomerRoutes()}</Routes>
        </DashboardProvider>
      </MetricsToCustomerProvider>
    </Suspense>
  );
}

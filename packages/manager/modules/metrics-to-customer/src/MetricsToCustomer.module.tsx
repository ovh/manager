import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { Routes } from 'react-router-dom';

import { IMetricsToCustomerModule } from '@/IMetricsToCustomerModule.interface';

import getMetricsToCustomerRoutes from '@/routes/routes';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { DashboardProvider, MetricsToCustomerProvider } from '@/contexts';
import { useIamRegionsAndCapabilitiesMetrics } from '@/data/hooks';
import { Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';

export function MetricsToCustomerModule(
  moduleProps: Readonly<IMetricsToCustomerModule>,
) {
  const { t } = useTranslation(NAMESPACES.MODULE);

  const {
    resourceName,
    productType,
    resourceURN,
    defaultRetention,
    subscriptionUrls,
    enableConfigurationManagement,
  } = moduleProps;

  const {
    isPending,
    isSuccess,
    regions,
    capabilitiesMetrics,
  } = useIamRegionsAndCapabilitiesMetrics(resourceURN);

  if (isPending) {
    return <Spinner size={SPINNER_SIZE.xs} />
  }

  const baseContext = {
    productType,
    resourceName,
    resourceURN,
    regions,
    capabilitiesMetrics,
  };

  const context = enableConfigurationManagement
    ? {
      ...baseContext,
      enableConfigurationManagement: true as const, defaultRetention: defaultRetention!, subscriptionUrls: subscriptionUrls!
    }
    : {
      ...baseContext,
      enableConfigurationManagement: false as const, defaultRetention, subscriptionUrls
    };

  return (
    <Suspense fallback={<div className="flex py-8">{t('loading_metrics_module')}</div>}>
      {
        isSuccess && (
          <MetricsToCustomerProvider context={context}>
            <DashboardProvider>
              <Routes>${getMetricsToCustomerRoutes()}</Routes>
            </DashboardProvider>
          </MetricsToCustomerProvider>
        )
      }
    </Suspense>
  );
}

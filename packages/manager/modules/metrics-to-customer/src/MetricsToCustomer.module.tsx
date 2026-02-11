import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { Routes } from 'react-router-dom';

import { IMetricsToCustomerModule } from '@/IMetricsToCustomerModule.interface';

import getMetricsToCustomerRoutes from '@/routes/routes';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { DashboardProvider, MetricsToCustomerProvider } from '@/contexts';
import { useIamResourceLocation } from '@/data/hooks';
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
    isLoading,
    isSuccess,    
    data,    
  } = useIamResourceLocation(resourceURN);

  const regions = [
    {
      code: data?.name ?? "",
      label: data?.location ?? ""
    }
  ];

  if (isLoading) {
    return <Spinner size={SPINNER_SIZE.xs} />
  }

  const baseContext = {
    productType,
    resourceName,
    resourceURN,
    regions,
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

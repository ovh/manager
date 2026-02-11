import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Message, MessageBody, MessageIcon, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { DataValueType } from '@/types/metrics.type';

import { useMetricsToCustomerContext } from '@/contexts/MetricsToCustomer.context';
import { useDashboardContext } from '@/contexts';

import { useDashboardData } from '@/hooks';

import { useMetricToken } from '@/data/hooks';

import { Dashboard, Loader } from '@/components';

const DashboardPage = () => {
  const { t } = useTranslation(NAMESPACES.DASHBOARDS);

  const { state: { resourceName, productType, resourceURN, regions, } } = useMetricsToCustomerContext();
  const { state: { regionAvailable } } = useDashboardContext();

  const { data: metricToken } = useMetricToken({ resourceName });

  const { charts, configLoading, refetchAll, cancelAll } = useDashboardData<DataValueType>(
    resourceName,
    productType,
    resourceURN,
    metricToken ?? '',
    regionAvailable,
  );

  if (configLoading) {
    return <Loader message={t('dashboard_loading')} />;
  }

  if (!charts || !charts.length) {
    return (
      <Message className="p-5 w-full" dismissible={false}>
        <MessageBody>{t('dashboard_no_widget')}</MessageBody>
      </Message>
    );
  }

  return (
    <Suspense>
      {
        !regionAvailable && (
          <Message className='w-full' color="warning">
            <MessageIcon name="triangle-exclamation" />
            <MessageBody>
              <Text preset={TEXT_PRESET.paragraph}>
                {t(`${NAMESPACES.MODULE}:metrics_region_not_available`, { region: regions[0]?.label })}
              </Text>
            </MessageBody>
          </Message>
        )
      }
      <Dashboard
        charts={charts}
        disabled={!regionAvailable}
        onRefresh={refetchAll}
        onCancel={cancelAll} />
      <Outlet />
    </Suspense>
  );
};

export default DashboardPage;

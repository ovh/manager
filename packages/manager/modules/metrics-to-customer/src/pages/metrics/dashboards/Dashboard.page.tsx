import { Outlet } from 'react-router-dom';
import { Message, MessageBody } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { DataValueType } from '@/types/metrics.type';

import { useMetricsToCustomerContext } from '@/contexts/MetricsToCustomer.context';

import { useDashboardData } from '@/hooks';

import { useMetricToken } from '@/data/hooks';

import { Dashboard, Loader } from '@/components';

const DashboardPage = () => {
  const { t } = useTranslation(NAMESPACES.DASHBOARDS);

  const { state: { resourceName, productType, resourceURN, } } = useMetricsToCustomerContext();  

  const { data: metricToken } = useMetricToken({ resourceName });

  const { charts, configLoading, refetchAll, cancelAll } = useDashboardData<DataValueType>(
    resourceName,
    productType,
    resourceURN,
    metricToken ?? '',
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
    <>
      <Dashboard
        charts={charts}
        onRefresh={refetchAll}
        onCancel={cancelAll} />
      <Outlet />
    </>
  );
};

export default DashboardPage;

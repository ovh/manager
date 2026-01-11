import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Message, MessageBody } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';
import { Dashboard, Loader } from '@/components';
import { useDashboardContext } from '@/contexts';
import { useDashboardData } from '@/hooks';
import { useMetricToken } from '@/data/hooks';

type DataValueType = {
  timestamp: number;
  value: number | undefined;
  value1: number | undefined;
  value2: number | undefined;
  value3: number | undefined;
};

const DashboardPage = () => {
  const { t } = useTranslation(NAMESPACES.DASHBOARDS);

  const { state } = useDashboardContext();

  const resourceName = state.resourceName ?? '';
  const productType = state.productType ?? '';
  const resourceURN = state.resourceURN ?? '';

  const { data: metricToken } = useMetricToken({resourceName});

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
      <Dashboard charts={charts} onRefresh={refetchAll} onCancel={cancelAll} />
      <Outlet />
    </>
  );
};

export default DashboardPage;

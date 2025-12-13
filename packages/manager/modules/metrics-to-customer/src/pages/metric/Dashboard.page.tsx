import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Message, MessageBody } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';
import { Dashboard, Loader } from '@/components';
import { useDashboardContext } from '@/contexts';
import { useDashboardData } from '@/hooks';

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
  const { charts, configLoading } = useDashboardData<DataValueType>(
    state.resourceName ?? '',
    state.productType ?? '',
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
      <Dashboard charts={charts} />
      <Outlet />
    </>
  );
};

export default DashboardPage;

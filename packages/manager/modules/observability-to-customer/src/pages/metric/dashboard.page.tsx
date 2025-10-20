import { Outlet, useParams } from 'react-router-dom';

import { t } from 'i18next';

import { Message } from '@ovhcloud/ods-react';

import { Dashboard, Loader } from '../../components';
import { useDashboardData } from '../../hooks';

type DataValueType = {
  timestamp: number;
  value: number | undefined;
  value1: number | undefined;
  value2: number | undefined;
  value3: number | undefined;
};

const DashboardPage = () => {
  const { serviceName, productType } = useParams();

  const { charts, configLoading } = useDashboardData<DataValueType>(
    serviceName ?? '',
    productType ?? '',
  );

  if (configLoading) {
    return <Loader message={t('dashboard-loading')} />;
  }

  if (!charts || !charts.length) {
    return <Message>{t('dashboard-no-widget')}</Message>;
  }

  return (
    <>
      <Dashboard charts={charts} />
      <Outlet />
    </>
  );
};

export default DashboardPage;

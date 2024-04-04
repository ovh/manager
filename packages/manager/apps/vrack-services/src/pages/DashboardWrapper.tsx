import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout-helpers';
import { useVrackService, useVrackServicesList } from '@/utils/vs-utils';
import NotFound from '@/pages/404';
import { ErrorPage } from '@/components/Error';
import { urls } from '@/router/constants';

export const DashboardWrapper: React.FC = () => {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const location = useLocation();
  const { data, isLoading } = useVrackServicesList();
  const { isError, error } = useVrackService();

  const tabList = [
    {
      name: 'overview',
      title: t('overviewTabLabel'),
      to: urls.overview.replace(':id', id),
    },
    {
      name: 'subnets',
      title: t('subnetsTabLabel'),
      to: urls.subnets.replace(':id', id),
    },
    {
      name: 'endpoints',
      title: t('endpointsTabLabel'),
      to: urls.endpoints.replace(':id', id),
    },
  ];

  if (isError) {
    return <ErrorPage error={error} />;
  }

  if (
    !isLoading &&
    !data?.data?.find((vrackServices) => vrackServices.id === id)
  ) {
    return <NotFound />;
  }

  return [urls.createEndpoint, urls.createSubnet]
    .map((url) => url.replace(':id', id))
    .includes(location.pathname) ? (
    <React.Suspense>
      <Outlet />
    </React.Suspense>
  ) : (
    <DashboardLayout tabs={tabList} />
  );
};

export default DashboardWrapper;

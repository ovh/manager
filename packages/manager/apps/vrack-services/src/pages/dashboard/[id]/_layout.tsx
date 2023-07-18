import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';
import { DashboardLayout } from '@/components/layout-helpers';
import { ErrorPage } from '@/components/Error';
import { useVrackServicesList } from '@/utils/vs-utils';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const location = useLocation();

  const { data, isError, error, isLoading } = useVrackServicesList();

  const tabsList = [
    {
      name: 'overview',
      title: t('overviewTabLabel'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'subnets',
      title: t('subnetsTabLabel'),
      to: useResolvedPath('Subnets').pathname,
    },
    {
      name: 'endpoints',
      title: t('endpointsTabLabel'),
      to: useResolvedPath('Endpoints').pathname,
    },
  ];

  if (
    isError ||
    (!isLoading &&
      !data?.data?.find((vrackServices) => vrackServices.id === id))
  ) {
    return <ErrorPage error={error} />;
  }

  return location.pathname.includes('create') ? (
    <Outlet />
  ) : (
    <DashboardLayout tabs={tabsList} />
  );
};

export default DashboardPage;

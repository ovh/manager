import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useResolvedPath } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BreadcrumbHandleParams } from '../../../components/Breadcrumb';
import {
  getVrackServicesResourceList,
  getVrackServicesResourceListQueryKey,
} from '@/api';
import { DashboardLayout } from '../../../components/layout-helpers';
import { ApiError, ErrorPage } from '../../../components/Error';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: getVrackServicesResourceListQueryKey,
    queryFn: () => getVrackServicesResourceList(),
  });

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
    return <ErrorPage error={error as ApiError} />;
  }

  return <DashboardLayout tabs={tabsList} />;
};

export default DashboardPage;

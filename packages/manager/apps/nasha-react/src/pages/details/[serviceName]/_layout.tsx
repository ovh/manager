import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResolvedPath } from 'react-router-dom';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@ovh-ux/manager-react-breadcrumb';
import DashboardLayoutHelpers from '@/components';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function NashaReactDetails() {
  const { t } = useTranslation('nasha-react/details');
  const tabsList = [
    {
      name: 'general_infos',
      title: t('tab_general'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'partitions',
      title: t('tab_partitions'),
      to: useResolvedPath('partitionsTab').pathname,
    },
  ];

  return (
    <>
      <Breadcrumb />
      <DashboardLayoutHelpers tabs={tabsList} />
    </>
  );
}

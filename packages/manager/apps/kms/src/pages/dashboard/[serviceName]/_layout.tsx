import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useResolvedPath } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { getiamPolicyPolicyId, getiamPolicyPolicyIdQueryKey } from '@/api';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import Errors from '@/components/Error/Error';

export default function DashboardPage() {
  const { t } = useTranslation('kms/dashboard');
  const { serviceName } = useParams();

  const tabsList = [
    {
      name: 'general_infos',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'custom tab',
      title: 'custom tab',
      to: useResolvedPath('Tabs2').pathname,
    },
  ];

  return (
    <div>
      <Breadcrumb />
      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
      </Suspense>
    </div>
  );
}

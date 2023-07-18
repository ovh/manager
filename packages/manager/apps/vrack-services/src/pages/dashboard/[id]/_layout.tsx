import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useResolvedPath } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { BreadcrumbHandleParams } from '../../../components/Breadcrumb/Breadcrumb';
import {
  getvrackServicesResourceVrackServicesId,
  getvrackServicesResourceVrackServicesIdQueryKey,
} from '../../../api';
import { DashboardLayout } from '../../../components/layout-helpers';
import { ErrorBanner } from '../../../components/Error/Error';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

export default function DashboardPage() {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const results: any = useQueries({
    queries: [
      {
        queryKey: [
          getvrackServicesResourceVrackServicesIdQueryKey({
            vrackServicesId: id,
          }),
        ],
        queryFn: () =>
          getvrackServicesResourceVrackServicesId({ vrackServicesId: id }),
        staleTime: Infinity,
      },
      // {
      //   queryKey: [
      //     getvrackServicesResourceVrackServicesIdServiceInfosQueryKey({
      //       vrackServicesId,
      //     }),
      //   ],
      //   queryFn: () =>
      //     getvrackServicesResourceVrackServicesIdServiceInfos({
      //       vrackServicesId,
      //     }),
      //   staleTime: Infinity,
      // },
    ],
  });

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

  if (results[0].status === 'success' && results[0]?.data?.status !== 200) {
    return <ErrorBanner error={results[0].data} />;
  }

  return <DashboardLayout tabs={tabsList} />;
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getManagerHubCatalogList,
  getManagerHubCatalogListQueryKey,
} from '@/api';
import Error from '@/components/Error/Error';

interface ServiceData {
  status: number;
  data: any;
}

export default function CatalogRevamp() {
  const { t } = useTranslation('catalog-revamp');

  const service: UseQueryResult<ServiceData> = useQuery({
    queryKey: getManagerHubCatalogListQueryKey,
    queryFn: () => getManagerHubCatalogList(),
    staleTime: Infinity,
  });

  if (!service.isLoading && service.data.status !== 200) {
    return <Error error={service.data} />;
  }
  const data = service.data?.data?.catalog?.data;
  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

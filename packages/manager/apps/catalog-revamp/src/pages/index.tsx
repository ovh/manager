import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { OsdsDivider } from '@ovhcloud/ods-stencil/components/react/';
import {
  getManagerHubCatalogList,
  getManagerHubCatalogListQueryKey,
} from '@/api';
import Loading from '@/components/Loading/Loading';
import Error from '@/components/Error/Error';
import SearchBar from '@/components/SearchBar/SearchBar';
import Filters from '@/components/Filters/Filters';

interface ServiceData {
  status: number;
  data: any;
}

export default function CatalogReact() {
  const { t } = useTranslation('catalog-revamp');

  const service: UseQueryResult<ServiceData> = useQuery({
    queryKey: getManagerHubCatalogListQueryKey,
    queryFn: () => getManagerHubCatalogList(),
    staleTime: Infinity,
  });

  if (service.isLoading) {
    return <Loading />;
  }

  if (!service.isLoading && service.data.status !== 200) {
    return <Error error={service.data} />;
  }

  const data = service.data?.data?.catalog?.data;
  return (
    <div>
      <h1>{t('title')}</h1>
      <SearchBar />
      <Filters />
      <OsdsDivider />
      <div>{JSON.stringify(service.data)}</div>
    </div>
  );
}

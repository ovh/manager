import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { OsdsDivider } from '@ovhcloud/ods-stencil/components/react/';
import { getProduct360ManagerHubCatalogList } from '@/api';
import Loading from '@/components/Loading/Loading';
import Error from '@/components/Error/Error';
import SearchBar from '@/components/SearchBar/SearchBar';
import Filters from '@/components/Filters/Filters';

interface ServiceData {
  status: number;
}

export default function CatalogReact() {
  const { t } = useTranslation('catalog-revamp');

  const service: UseQueryResult<ServiceData> = useQueries({
    queries: [
      {
        queryKey: ['hubCatalog'],
        queryFn: () => getProduct360ManagerHubCatalogList(),
        staleTime: Infinity,
      },
    ],
  })[0] as UseQueryResult<ServiceData>;

  if (!service?.data) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{t('title')}</h1>
      <SearchBar />
      <Filters />
      <OsdsDivider />
      <div>
        <Suspense fallback={<Loading />}>
          {JSON.stringify(service.data)}
        </Suspense>
      </div>
    </div>
  );
}

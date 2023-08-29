import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { getProduct360ManagerHubCatalogList } from '@/api';
import Loading from '@/components/Loading/Loading';
import Error from '@/components/Error/Error';

interface ServiceData {
  status: number;
}

export default function CatalogReact() {
  const { t } = useTranslation('catalog-react');

  const service: UseQueryResult<ServiceData> = useQueries({
    queries: [
      {
        queryKey: ['hubCatalog'],
        queryFn: () => getProduct360ManagerHubCatalogList(),
        staleTime: Infinity,
      },
    ],
  })[0] as UseQueryResult<ServiceData>;

  if (service?.data?.status && service?.data?.status !== 200) {
    return <Error error={service.data} />;
  }

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Catalog</div>
      <div>
        <Suspense fallback={<Loading />}>
          {JSON.stringify(service.data)}
        </Suspense>
      </div>
    </div>
  );
}

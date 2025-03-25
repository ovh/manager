import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  useResourcesIcebergV6,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import Loading from '@/alldoms/components/Loading/Loading';

import appConfig from '@/web-domains.config';
import { useAllDomDatagridColumns } from '@/alldoms/hooks/useAllDomDatagridColumns';
import { useGetDatagridServiceInfoList } from '@/alldoms/hooks/data/useDatagridServiceInfoList';
import { TServiceProperty } from '@/alldoms/types';

export default function ServiceList() {
  const { t } = useTranslation('allDom');
  const { t: tError } = useTranslation('web-domains/error');
  const {
    flattenData: domainList,
    isError,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    totalCount,
    setSorting,
  } = useResourcesIcebergV6<TServiceProperty>({
    route: '/allDom',
    queryKey: ['/allDom'],
    pageSize: 30,
  });
  const { serviceInfoList } = useGetDatagridServiceInfoList({
    domainList,
  });
  const columns = useAllDomDatagridColumns();
  const header = {
    title: t('title'),
  };

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: tError('manager_error_page_default') },
        }}
      />
    );
  }

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={appConfig.rootLabel} appName="web-domains" />
      }
      header={header}
    >
      <React.Suspense>
        {!isLoading && (
          <div data-testId="datagrid">
            <Datagrid
              columns={columns}
              items={serviceInfoList}
              totalItems={totalCount}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
              sorting={sorting}
              onSortChange={setSorting}
            />
          </div>
        )}
      </React.Suspense>
    </BaseLayout>
  );
}

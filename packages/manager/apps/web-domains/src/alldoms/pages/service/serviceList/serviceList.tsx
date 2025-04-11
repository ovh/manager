import React from 'react';
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
  const { t } = useTranslation(['allDom', 'web-domains/error']);
  const {
    flattenData: allDomList,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    totalCount,
    setSorting,
  } = useResourcesIcebergV6<TServiceProperty>({
    route: '/allDom',
    queryKey: ['/allDom'],
    pageSize: 30,
  });
  const { serviceInfoList, listLoading } = useGetDatagridServiceInfoList({
    allDomList,
  });
  const columns = useAllDomDatagridColumns();
  const header = {
    title: t('title'),
  };

  if (listLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: error.message },
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
        <div data-testid="datagrid">
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
      </React.Suspense>
    </BaseLayout>
  );
}

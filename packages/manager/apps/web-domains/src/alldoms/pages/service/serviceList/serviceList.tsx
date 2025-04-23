import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  useResourcesIcebergV6,
  ErrorBanner,
  useNotifications,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import Loading from '@/alldoms/components/Loading/Loading';

import appConfig from '@/web-domains.config';
import { useAllDomDatagridColumns } from '@/alldoms/hooks/allDomDatagrid/useAllDomDatagridColumns';
import { useGetDatagridServiceInfoList } from '@/alldoms/hooks/data/useGetDatagridServiceInfoList';
import { TServiceProperty } from '@/alldoms/types';

export default function ServiceList() {
  const { t } = useTranslation(['allDom', 'web-domains/error']);
  const { notifications } = useNotifications();

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

  const { data: serviceInfoList, listLoading } = useGetDatagridServiceInfoList({
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
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
      header={header}
      message={notifications.length ? <Notifications /> : null}
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
          <Outlet />
        </div>
      </React.Suspense>
    </BaseLayout>
  );
}

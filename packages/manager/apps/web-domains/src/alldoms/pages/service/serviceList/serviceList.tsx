import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  BaseLayout,
  useResourcesIcebergV6,
  ErrorBanner,
  useNotifications,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import { useAllDomDatagridColumns } from '@/alldoms/hooks/allDomDatagrid/useAllDomDatagridColumns';
import { useGetAllDoms } from '@/alldoms/hooks/data/useGetAllDoms';
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
    pageSize: 10,
  });

  const { data: serviceInfoList, listLoading } = useGetAllDoms({
    allDomList,
  });

  const columns = useAllDomDatagridColumns();

  const header = {
    title: t('title'),
  };

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
      header={header}
      message={notifications.length ? <Notifications /> : null}
    >
      <div data-testid="datagrid">
        <Datagrid
          columns={columns}
          items={serviceInfoList}
          totalItems={totalCount}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          isLoading={listLoading}
        />
        <Outlet />
      </div>
    </BaseLayout>
  );
}

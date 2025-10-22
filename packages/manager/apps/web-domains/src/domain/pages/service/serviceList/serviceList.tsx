import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  useResourcesIcebergV2,
  ErrorBanner,
  useNotifications,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import appConfig from '@/web-domains.config';
import { useDomainDatagridColumns } from '@/domain/hooks/useDomainDatagridColumns';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();

  const {
    flattenData: domainResources,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    sorting,
    setSorting,
  } = useResourcesIcebergV2<any>({
    route: '/domain/name',
    queryKey: ['/domain/name'],
    pageSize: 10,
  });

  const columns = useDomainDatagridColumns();

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
      <div data-testid="datagrid">
        <Datagrid
          isLoading={isLoading}
          columns={columns}
          items={domainResources}
          totalItems={domainResources?.length ?? 0}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
        />
        <Outlet />
      </div>
    </BaseLayout>
  );
}

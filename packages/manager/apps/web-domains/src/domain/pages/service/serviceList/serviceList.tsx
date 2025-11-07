import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  ErrorBanner,
  useNotifications,
  Notifications,
  useResourcesIcebergV6,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';

import appConfig from '@/web-domains.config';
import { DomainService } from '@/domain/types/domainResource';
import { useDomainDatagridColumns } from '@/domain/hooks/useDomainDatagridColumns';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();
  const [columns] = useState([]);

  const {
    flattenData: domainResources,
    isLoading,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    sorting,
    setSorting,
  } = useResourcesIcebergV6<DomainService>({
    columns,
    route: '/domain',
    queryKey: ['/domain'],
  });

  const domainColumns = useDomainDatagridColumns();
  const header = {
    title: t('title'),
  };

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: {
            message: error.message,
          },
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
        <RedirectionGuard
          isLoading={isLoading || !domainResources}
          condition={isSuccess && domainResources?.length === 0}
          route={''}
          isError={isError}
        >
          {columns && (
            <Datagrid
              isLoading={isLoading}
              columns={domainColumns}
              items={domainResources}
              totalItems={totalCount || 0}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
              sorting={sorting}
              onSortChange={setSorting}
            />
          )}
        </RedirectionGuard>

        <Outlet />
      </div>
    </BaseLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import {
  Datagrid,
  useResourcesIcebergV6,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { DedicatedServer } from '@/data/types/server.type';
import OrderMenu from '@/components/orderMenu';
import { getColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';

export default function ServerListing() {
  const [columns] = useState([]);
  const [visibleColumns] = useState([
    'name',
    'ip',
    'model',
    'region',
    'status',
    'actions',
    'tags',
  ]);
  const { t } = useTranslation('dedicated-servers');
  const {
    flattenData,
    isError,
    sorting,
    setSorting,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    filters,
  } = useResourcesIcebergV6({
    columns,
    route: `/dedicated/server`,
    queryKey: ['dedicated-servers', `/dedicated/server`],
  });
  const { error: errorListing, data: dedicatedServer } = useDedicatedServer();

  return (
    <>
      {(isError || errorListing) && (
        <ErrorComponent error={isError ? (error as ApiError) : errorListing} />
      )}
      {!(isError || errorListing) && (
        <RedirectionGuard
          isLoading={isLoading || !dedicatedServer}
          condition={dedicatedServer && dedicatedServer?.length === 0}
          route={urls.onboarding}
        >
          <React.Suspense>
            {
              <div>
                <Datagrid
                  columns={getColumns(t)}
                  items={flattenData}
                  totalItems={totalCount || 0}
                  hasNextPage={hasNextPage && !isLoading}
                  onFetchNextPage={fetchNextPage}
                  sorting={sorting}
                  onSortChange={setSorting}
                  isLoading={isLoading}
                  filters={filters}
                  columnVisibility={visibleColumns}
                  search={search}
                  className="server-data-grid"
                  topbar={<OrderMenu />}
                  resourceType="dedicatedServer"
                />
              </div>
            }
          </React.Suspense>
        </RedirectionGuard>
      )}
    </>
  );
}

import React, { useContext } from 'react';
import { Datagrid, useDataApi, RedirectionGuard } from '@ovh-ux/muk';
import { ApiError } from '@ovh-ux/manager-core-api';
import OrderMenu from '@/components/orderMenu';
import { useColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';
import { DedicatedServer } from '@/data/types/server.type';
import { ViewContext } from '@/components/manageView/viewContext';

export default function ServerDatagrid() {
  const columns = useColumns();
  const { columnVisibility, setColumnVisibility, columnsConfig } = useContext(
    ViewContext,
  );

  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    filters,
  } = useDataApi<DedicatedServer>({
    version: 'v6',
    iceberg: true,
    enabled: true,
    route: `/dedicated/server`,
    cacheKey: ['dedicated-servers', `/dedicated/server`],
  });
  const { error: errorListing, data: dedicatedServer } = useDedicatedServer();

  return (
    <>
      {(isError || errorListing) && (
        <ErrorComponent error={isError ? (error as ApiError) : errorListing} />
      )}
      {!isError && !errorListing && (
        <RedirectionGuard
          isLoading={isLoading || !dedicatedServer}
          condition={dedicatedServer && dedicatedServer?.length === 0}
          route={urls.onboarding}
        >
          {flattenData && (
            <div>
              <Datagrid
                columns={columnsConfig}
                data={flattenData}
                totalCount={totalCount || 0}
                hasNextPage={hasNextPage && !isLoading}
                onFetchNextPage={fetchNextPage}
                sorting={sorting}
                isLoading={isLoading}
                filters={filters}
                columnVisibility={{ columnVisibility, setColumnVisibility }}
                search={search}
                topbar={<OrderMenu exportCsvData={{ columns, totalCount }} />}
                resourceType="dedicatedServer"
              />
            </div>
          )}
        </RedirectionGuard>
      )}
    </>
  );
}

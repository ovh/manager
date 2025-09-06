import React, { useState } from 'react';
import './index.scss';
import {
  Datagrid,
  useResourcesIcebergV6,
  useDataGrid,
  ColumnSort,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { DedicatedServer } from '@/data/types/server.type';
import OrderMenu from '@/components/orderMenu';
import { useColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';

export default function ServerListing() {
  const columns = useColumns();
  const [visibleColumns] = useState([
    'iam.displayName',
    'ip',
    'model',
    'region',
    'state',
    'actions',
    'tags',
  ]);
  const { sorting, setSorting } = useDataGrid({
    id: 'iam_displayName',
    desc: false,
  });
  const {
    flattenData,
    isError,
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

  const sortServersListing = (
    colSorting: ColumnSort,
    originalList: DedicatedServer[] = [],
  ) => {
    const serverList = [...originalList];
    serverList.sort((s1, s2) => {
      const key = colSorting.id as keyof DedicatedServer;
      if (key.toString().includes('displayName')) {
        return (s1.iam?.displayName).localeCompare(s2.iam?.displayName);
      }
      if (key && Object.keys(s1).includes(key as string)) {
        return (s1[key].toString() || '').localeCompare(s2[key].toString());
      }
      return 0;
    });

    return colSorting?.desc ? serverList.reverse() : serverList;
  };

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
            {flattenData && (
              <div>
                <Datagrid
                  columns={columns}
                  items={sortServersListing(
                    sorting,
                    (flattenData as unknown) as DedicatedServer[],
                  )}
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
            )}
          </React.Suspense>
        </RedirectionGuard>
      )}
    </>
  );
}

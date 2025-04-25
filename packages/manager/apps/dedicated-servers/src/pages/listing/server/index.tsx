import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import './index.scss';
import {
  Datagrid,
  ErrorBanner,
  useResourcesIcebergV6,
  useDataGrid,
  ColumnSort,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import OrderMenu from '@/components/orderMenu';
import { getColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';

export default function ServerListing() {
  const [columns] = useState([]);
  const [visibleColumns] = useState([
    'name',
    'ip',
    'model',
    'region',
    'status',
    'actions',
  ]);
  const { t } = useTranslation('dedicated-servers');
  const { shell } = React.useContext(ShellContext);
  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
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
    isSuccess,
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
      if (key.toString() === 'displayName') {
        return (s1.iam?.displayName).localeCompare(s2.iam?.displayName);
      }
      if (key && Object.keys(s1).includes(key as string)) {
        return (s1[key].toString() || '').localeCompare(s2[key].toString());
      }
      return 0;
    });

    return colSorting?.desc ? serverList.reverse() : serverList;
  };

  if (isError || errorListing) {
    let errorObj;
    if (isError) {
      const { response }: any = error;
      errorObj = {
        data: error,
        headers: response?.headers,
        status: response?.status,
      };
    } else {
      errorObj = errorListing;
    }
    return <ErrorBanner error={errorObj} />;
  }

  return (
    <RedirectionGuard
      isLoading={isLoading || !dedicatedServer}
      condition={dedicatedServer && dedicatedServer?.length === 0}
      route={urls.onboarding}
    >
      <React.Suspense>
        {flattenData && (
          <div>
            <Datagrid
              columns={getColumns(t, (name: string) =>
                shell.navigation.navigateTo(
                  'dedicated',
                  `#/server/${name}`,
                  {},
                ),
              )}
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
            />
          </div>
        )}
      </React.Suspense>
    </RedirectionGuard>
  );
}

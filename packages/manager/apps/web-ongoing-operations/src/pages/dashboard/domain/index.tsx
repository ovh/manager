import React from 'react';

import {
  Datagrid,
  useResourcesIcebergV6,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import { useDatagridColumn } from '@/hooks/useDatagridColumns';

export default function Domain() {
  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    pageIndex,
  } = useResourcesIcebergV6({
    route: `/me/task/domain`,
    queryKey: ['web-ongoing-operations', `/me/task/domain`],
  });

  const columns = useDatagridColumn(true, flattenData);

  if (isError) {
    return <ErrorBanner error={error.message} />;
  }

  if (isLoading && pageIndex === 1) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense>
      {flattenData && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
        />
      )}
    </React.Suspense>
  );
}

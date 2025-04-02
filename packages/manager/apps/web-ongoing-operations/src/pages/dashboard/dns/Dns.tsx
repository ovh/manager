import React from 'react';
import {
  Datagrid,
  ErrorBanner,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import {
  ParentEnum,
  useOngoingOperationDatagridColumns,
} from '@/hooks/useOngoingOperationDatagridColumns';
import { taskMeDns } from '@/constants';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');

  const {
    flattenData: dnsList,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDns,
    queryKey: [taskMeDns],
    pageSize: 30,
  });

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.Zone,
    dnsList as TOngoingOperations[],
  );

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: tError('manager_error_page_default') },
        }}
      />
    );
  }

  return (
    <React.Suspense>
      {dnsList && (
        <div data-testid="dns">
          <Datagrid
            columns={columns}
            items={dnsList}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            filters={filters}
          />
        </div>
      )}
    </React.Suspense>
  );
}

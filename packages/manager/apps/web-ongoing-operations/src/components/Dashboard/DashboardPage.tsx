import {
  Datagrid,
  ErrorBanner,
  Notification,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TOngoingOperations } from '@/types';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { ParentEnum } from '@/enum/parent.enum';
import Loading from '@/components/Loading/Loading';

interface DashboardPageProps {
  parent: ParentEnum;
  notifications: Notification[];
  route: string;
  queryKey: string[];
  testID: string;
}

export default function DashboardPage({
  parent,
  notifications,
  route,
  queryKey,
  testID,
}: DashboardPageProps) {
  const { t: tError } = useTranslation('web-ongoing-operations/error');

  const {
    flattenData,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route,
    queryKey,
    pageSize: 30,
    disableCache: !!notifications.length,
  });

  const columns = useOngoingOperationDatagridColumns(parent);

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

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <React.Suspense>
      {flattenData && (
        <div data-testid={`${testID}`}>
          <Datagrid
            columns={columns}
            items={flattenData}
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

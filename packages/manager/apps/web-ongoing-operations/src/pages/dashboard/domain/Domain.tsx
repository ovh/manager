import React, { useState } from 'react';
import {
  Datagrid,
  ErrorBanner,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { taskMeDomain } from '@/constants';
import { TOngoingOperations } from '@/types';
import { ParentEnum } from '@/enum/parent.enum';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');

  const {
    flattenData: domainList,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    sorting,
    setSorting,
    filters,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDomain,
    queryKey: [taskMeDomain],
    pageSize: 30,
  });

  const columns = useOngoingOperationDatagridColumns(
    ParentEnum.DOMAIN,
    domainList,
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
      {domainList && (
        <div data-testid="datagrid">
          <Datagrid
            columns={columns}
            items={domainList}
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

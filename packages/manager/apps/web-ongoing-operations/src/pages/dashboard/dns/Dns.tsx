import { toASCII } from 'punycode';
import React from 'react';
import {
  Datagrid,
  ErrorBanner,
  useNotifications,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { taskMeDns } from '@/constants';
import { ParentEnum } from '@/enum/parent.enum';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');
  const { notifications } = useNotifications();

  const columns = useOngoingOperationDatagridColumns(ParentEnum.ZONE);

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
    search,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDns.join('/'),
    queryKey: taskMeDns,
    pageSize: 30,
    disableCache: !!notifications.length,
    columns,
  });

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
            search={{
              searchInput: search.searchInput,
              setSearchInput: search.setSearchInput,
              onSearch: (value) => {
                search.onSearch(toASCII(value));
              },
            }}
          />
        </div>
      )}
    </React.Suspense>
  );
}

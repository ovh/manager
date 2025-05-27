import React, { useEffect, useState } from 'react';
import {
  Datagrid,
  ErrorBanner,
  useNotifications,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { TOngoingOperations } from 'src/types';
import { useTranslation } from 'react-i18next';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { taskMeDns } from '@/constants';
import { ParentEnum } from '@/enum/parent.enum';

export default function Domain() {
  const { t: tError } = useTranslation('web-ongoing-operations/error');
  const { notifications } = useNotifications();
  const [searchInput, setSearchInput] = useState('');

  const columns = useOngoingOperationDatagridColumns(ParentEnum.ZONE);

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
    search,
  } = useResourcesIcebergV6<TOngoingOperations>({
    route: taskMeDns.join('/'),
    queryKey: taskMeDns,
    pageSize: 30,
    disableCache: !!notifications.length,
    columns,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(searchInput.toLowerCase());
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    search.onSearch(search.searchInput);
  }, [search.searchInput]);

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
      <div data-testid="datagrid">
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          filters={filters}
          isLoading={isLoading}
          search={{
            searchInput,
            setSearchInput,
            onSearch: () => null,
          }}
        />
      </div>
    </React.Suspense>
  );
}

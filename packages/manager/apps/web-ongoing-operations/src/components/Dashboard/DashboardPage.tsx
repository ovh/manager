import {
  Datagrid,
  ErrorBanner,
  Notification,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toASCII } from 'punycode';
import { TOngoingOperations } from '@/types';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { ParentEnum } from '@/enum/parent.enum';

interface DashboardPageProps {
  readonly parent: ParentEnum;
  readonly notifications: Notification[];
  readonly route: string;
  readonly queryKey: string[];
  readonly searchableColumnID: string;
}

export default function DashboardPage({
  parent,
  notifications,
  route,
  queryKey,
  searchableColumnID,
}: DashboardPageProps) {
  const [searchInput, setSearchInput] = useState('');
  const { t: tError } = useTranslation('web-ongoing-operations/error');
  const columns = useOngoingOperationDatagridColumns(
    searchableColumnID,
    parent,
  );

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
    route,
    queryKey,
    pageSize: 30,
    disableCache: !!notifications.length,
    columns,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      search.setSearchInput(toASCII(searchInput.toLowerCase()));
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
          isLoading={isLoading}
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortChange={setSorting}
          filters={filters}
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

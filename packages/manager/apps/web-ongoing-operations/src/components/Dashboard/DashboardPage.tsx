import {
  Datagrid,
  ErrorBanner,
  SearchProps,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOngoingOperations } from '@/types';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { ParentEnum } from '@/enum/parent.enum';
import { useSearchParams } from 'react-router-dom';
import { toASCII } from 'punycode';

interface DashboardPageProps {
  readonly parent: ParentEnum;
  readonly route: string;
  readonly queryKey: string[];
  readonly searchableColumnID: string;
}

export default function DashboardPage({
  parent,
  route,
  queryKey,
  searchableColumnID,
}: DashboardPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get('search') || '',
  );
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
    pageSize: 10,
    disableCache: true,
    columns,
  });

  const updateUrlParams = useCallback(
    (updater: (params: URLSearchParams) => void): void => {
      const next = new URLSearchParams(searchParams);
      updater(next);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const onSearch = useCallback(
    (value?: string) => {
      updateUrlParams((params) => {
        if (value && value.length > 0) {
          params.set('search', value);
        } else {
          params.delete('search');
        }
      });
      setSearchInput(value ?? '');
    },
    [updateUrlParams],
  );

  const searchProps: SearchProps = useMemo(
    () => ({
      onSearch,
      searchInput,
      setSearchInput,
    }),
    [onSearch, searchInput],
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      const value = toASCII(searchInput.toLowerCase());
      search.setSearchInput(value);
      onSearch(value);
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
          search={searchProps}
        />
      </div>
    </React.Suspense>
  );
}

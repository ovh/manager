import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { OdsText } from '@ovhcloud/ods-components/react';

import { FilterComparator, applyFilters } from '@ovh-ux/manager-core-api';
import { icebergListingQueryKey } from '@ovh-ux/manager-module-vcd-api';
import {
  ChangelogButton,
  Datagrid,
  DatagridColumn,
  useColumnFilters,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';

import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';
import { DisplayStatus } from '@/components/status/DisplayStatus';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import TDatagridRoute from '@/types/datagrid-route.type';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { UpdatableResource, hasResourceUpdatingTargetSpec } from '@/utils/refetchConditions';

export type TDatagridContainerProps = {
  route: TDatagridRoute;
  title: string;
  isEmbedded?: boolean;
  queryKey: string[];
  columns: DatagridColumn<unknown>[];
  orderButton?: React.JSX.Element;
  withFilter?: boolean;
  columnsSearchable?: string;
  mapper?: (args: unknown[]) => unknown[];
  shouldFetchAll?: boolean;
};

export default function DatagridContainer({
  title,
  queryKey,
  isEmbedded = false,
  route: { api, onboarding },
  columns,
  orderButton,
  withFilter,
  columnsSearchable,
  mapper,
  shouldFetchAll = false,
}: Readonly<TDatagridContainerProps>) {
  const navigate = useNavigate();
  const listingQueryKey = [...queryKey, icebergListingQueryKey];
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');

  const {
    data,
    flattenData,
    fetchNextPage,
    hasNextPage,
    error,
    isLoading,
    status,
    sorting,
    setSorting,
  } = useResourcesIcebergV2({
    route: api,
    queryKey: listingQueryKey,
    shouldFetchAll,
  });

  useAutoRefetch({
    queryKey: listingQueryKey,
    enabled: hasResourceUpdatingTargetSpec(flattenData as unknown as UpdatableResource[]),
    interval: 4000,
  });

  useEffect(() => {
    if (status === 'success' && data?.pages[0]?.data.length === 0 && onboarding) {
      navigate(onboarding);
    }
  }, [data, navigate, onboarding, status]);

  if (isLoading) return <DisplayStatus variant="loading" />;
  if (error || !flattenData?.length)
    return (
      <DisplayStatus
        // TODO: Replace with a proper error message
        variant="customError"
        error={{ status: 500, data: { message: 'An error occured while fetching data' } }}
      />
    );

  const layoutCss = `px-10 pt-${isEmbedded ? '0' : '5'}`;

  return (
    <section className={layoutCss} aria-labelledby="datagrid-title">
      <div className="mt-4 flex items-center justify-between">
        <OdsText
          id="datagrid-title"
          preset={isEmbedded ? 'heading-3' : 'heading-1'}
          className={isEmbedded ? '' : 'mb-8'}
        >
          {title}
        </OdsText>
        {!isEmbedded && (
          <div className="flex">
            <ChangelogButton links={CHANGELOG_LINKS} />
            <VcdGuidesHeader />
          </div>
        )}
      </div>
      {orderButton && <div className="mb-8 mt-4 w-fit">{orderButton}</div>}
      <React.Suspense>
        {flattenData.length && (
          <Datagrid
            columns={columns}
            items={applyFilters(
              (mapper ? mapper?.(flattenData) : flattenData) ?? [],
              !searchInput || searchInput.length === 0
                ? filters
                : [
                    {
                      key: columnsSearchable || '',
                      value: searchInput,
                      comparator: FilterComparator.Includes,
                    },
                    ...filters,
                  ],
            )}
            totalItems={0}
            onFetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage && !isLoading}
            sorting={sorting}
            onSortChange={setSorting}
            manualSorting={false}
            contentAlignLeft
            filters={withFilter ? { filters, add: addFilter, remove: removeFilter } : undefined}
            search={{
              searchInput,
              setSearchInput,
              onSearch: () => {},
            }}
          />
        )}
      </React.Suspense>
    </section>
  );
}

import {
  ChangelogButton,
  Datagrid,
  DatagridColumn,
  ErrorBanner,
  useColumnFilters,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icebergListingQueryKey } from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { applyFilters, FilterComparator } from '@ovh-ux/manager-core-api';
import Loading from '@/components/loading/Loading.component';
import TDatagridRoute from '@/types/datagrid-route.type';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import {
  hasResourceUpdatingTargetSpec,
  UpdatableResource,
} from '@/utils/refetchConditions';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';

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
    isError,
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
    enabled: hasResourceUpdatingTargetSpec(
      (flattenData as unknown) as UpdatableResource[],
    ),
    interval: 4000,
  });

  useEffect(() => {
    if (
      status === 'success' &&
      data?.pages[0].data.length === 0 &&
      onboarding
    ) {
      navigate(onboarding);
    }
  }, [data]);

  if (isError) {
    // return <ErrorBanner error={error} />;
    // TODO temporary fix
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: 'An error occured while fetching data' },
        }}
      />
    );
  }

  if (isLoading && !flattenData?.length) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const layoutCss = `px-10 pt-${isEmbedded ? '0' : '5'}`;

  return (
    <section className={layoutCss} aria-labelledby="datagrid-title">
      <div className="flex items-center justify-between mt-4">
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
      {orderButton && <div className="w-fit mt-4 mb-8">{orderButton}</div>}
      <React.Suspense>
        {flattenData?.length && (
          <Datagrid
            columns={columns}
            items={applyFilters(
              (mapper ? mapper?.(flattenData) : flattenData) ?? [],
              !searchInput || searchInput.length === 0
                ? filters
                : [
                    {
                      key: columnsSearchable,
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
            filters={
              withFilter
                ? { filters, add: addFilter, remove: removeFilter }
                : undefined
            }
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

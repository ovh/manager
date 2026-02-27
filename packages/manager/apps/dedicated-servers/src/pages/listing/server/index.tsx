import React, { useState } from 'react';
import './index.scss';
import { Datagrid, useDataApi, RedirectionGuard } from '@ovh-ux/muk';
import { ApiError, FilterComparator } from '@ovh-ux/manager-core-api';
import { VisibilityState } from '@tanstack/react-table';
import { FilterWithLabel } from '@ovh-ux/muk/dist/types/src/components/filters/Filter.props';
import OrderMenu from '@/components/orderMenu';
import { useColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';
import { DedicatedServer } from '@/data/types/server.type';
import { useGetTemplateInfos } from '@/hooks/useGetTemplateInfo';

export default function ServerListing() {
  const { templateList } = useGetTemplateInfos();
  const columns = useColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    serverId: false,
    displayName: true,
    ip: true,
    reverse: false,
    commercialRange: true,
    os: false,
    region: true,
    rack: false,
    datacenter: false,
    state: true,
    monitoring: false,
    vrack: false,
    renew: false,
    expiration: false,
    engagement: false,
    price: false,
    tags: true,
    actions: true,
    availabilityZone: false,
  });

  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    filters,
  } = useDataApi<DedicatedServer>({
    version: 'v6',
    iceberg: true,
    enabled: true,
    route: `/dedicated/server`,
    cacheKey: ['dedicated-servers', `/dedicated/server`],
  });
  const { error: errorListing, data: dedicatedServer } = useDedicatedServer();

  const fnFilter = { ...filters };
  fnFilter.add = (value: FilterWithLabel) => {
    const curentFilter = { ...value };
    if (curentFilter.key === 'os') {
      const tps = templateList.filter((template) =>
        template.description
          .toLowerCase()
          .includes((curentFilter.value as string).toLowerCase()),
      );
      if (!tps.length) return;
      curentFilter.displayValue = curentFilter.value as string;
      if (curentFilter.comparator === FilterComparator.Includes) {
        if (tps.length === 1) {
          curentFilter.value = tps[0]?.templateName;
        } else {
          curentFilter.comparator = FilterComparator.IsIn;
          curentFilter.value = tps.map((os) => os.templateName);
        }
      } else {
        curentFilter.value = tps[0]?.templateName;
      }
    }
    filters.add(curentFilter);
  };

  return (
    <>
      {(isError || errorListing) && (
        <ErrorComponent error={isError ? (error as ApiError) : errorListing} />
      )}
      {!isError && !errorListing && (
        <RedirectionGuard
          isLoading={isLoading || !dedicatedServer}
          condition={dedicatedServer && dedicatedServer?.length === 0}
          route={urls.onboarding}
        >
          {flattenData && (
            <div>
              <Datagrid
                columns={columns}
                data={flattenData}
                totalCount={totalCount || 0}
                hasNextPage={hasNextPage && !isLoading}
                onFetchNextPage={fetchNextPage}
                sorting={sorting}
                isLoading={isLoading}
                filters={fnFilter}
                columnVisibility={{ columnVisibility, setColumnVisibility }}
                search={search}
                topbar={<OrderMenu exportCsvData={{ columns, totalCount }} />}
                resourceType="dedicatedServer"
              />
            </div>
          )}
        </RedirectionGuard>
      )}
    </>
  );
}

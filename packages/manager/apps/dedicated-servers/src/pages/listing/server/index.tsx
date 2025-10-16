import React, { useState } from 'react';
import './index.scss';
import {
  Datagrid,
  useResourcesIcebergV6,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { ApiError, FilterComparator } from '@ovh-ux/manager-core-api';
import OrderMenu from '@/components/orderMenu';
import { useColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';
import { useGetTemplateInfos } from '@/hooks/useGetTemplateInfo';

export default function ServerListing() {
  const { templateList } = useGetTemplateInfos();
  const columns = useColumns();
  const [columnVisibility, setColumnVisibility] = useState([
    'iam.displayName',
    'ip',
    'commercialRange',
    'region',
    'state',
    'tags',
    'actions',
  ]);

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
    setSorting,
    filters,
  } = useResourcesIcebergV6({
    columns,
    route: `/dedicated/server`,
    queryKey: ['dedicated-servers', `/dedicated/server`],
  });
  const { error: errorListing, data: dedicatedServer } = useDedicatedServer();

  const fnFilter = { ...filters };
  fnFilter.add = (value) => {
    const curentFilter = { ...value };
    if (curentFilter.key === 'os') {
      const tps = templateList.filter((template) =>
        template.description
          .toLowerCase()
          .includes((curentFilter.value as string).toLowerCase()),
      );
      if (!tps.length) return;
      curentFilter.tagLabel = curentFilter.value as string;
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
      {!(isError || errorListing) && (
        <RedirectionGuard
          isLoading={isLoading || !dedicatedServer}
          condition={dedicatedServer && dedicatedServer?.length === 0}
          route={urls.onboarding}
        >
          <React.Suspense>
            {flattenData && (
              <div>
                <Datagrid
                  columns={columns}
                  items={flattenData}
                  totalItems={totalCount || 0}
                  hasNextPage={hasNextPage && !isLoading}
                  onFetchNextPage={fetchNextPage}
                  sorting={sorting}
                  onSortChange={setSorting}
                  isLoading={isLoading}
                  filters={fnFilter}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  search={search}
                  className="server-data-grid"
                  topbar={<OrderMenu />}
                  resourceType="dedicatedServer"
                />
              </div>
            )}
          </React.Suspense>
        </RedirectionGuard>
      )}
    </>
  );
}

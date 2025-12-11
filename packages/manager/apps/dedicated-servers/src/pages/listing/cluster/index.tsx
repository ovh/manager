import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  Datagrid,
  useDataApi,
  DatagridColumn,
  RedirectionGuard,
} from '@ovh-ux/muk';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SortingState } from '@tanstack/react-table';
import useLinkUtils, { UrlEntry } from '@/hooks/useLinkUtils';
import { orderLinks } from '@/data/constants/orderLinks';
import { Cluster } from '@/data/types/cluster.type';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';

export default function Listing() {
  const [columns] = useState([]);
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('cluster');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const links = useLinkUtils<UrlEntry>(orderLinks);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: columns[0]?.iam?.displayName || '',
      desc: false,
    },
  ]);

  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isSuccess,
    search,
    filters,
  } = useDataApi<Cluster[]>({
    version: 'v6',
    iceberg: true,
    enabled: true,
    columns,
    route: `/dedicated/cluster`,
    cacheKey: ['dedicated-servers', `/dedicated/cluster`],
  });

  const sortClusterListing = (
    cluSorting: SortingState,
    originalList: Cluster[] = [],
  ) => {
    const clusterList = [...originalList];
    clusterList.sort((item1, item2) => {
      switch (cluSorting[0]?.id) {
        case 'iam.displayName':
          return (item1.iam?.displayName).localeCompare(item2.iam?.displayName);
        case 'model':
          return (item1.model || '').localeCompare(item2.model);
        case 'region':
          return (item1.region || '').localeCompare(item2.region);
        default:
          return 0;
      }
    });

    return cluSorting[0]?.desc ? clusterList.reverse() : clusterList;
  };

  const clusterColumns: DatagridColumn<Cluster>[] = [
    {
      id: 'iam.displayName',
      isSearchable: true,
      isFilterable: true,
      enableHiding: false,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_name'),
      header: t('dedicated_clusters_name'),
      cell: ({ row: { original: item } }) => (
        <div>
          <OdsLink
            color="primary"
            href={`#/cluster/${item.id}`}
            onClick={() => {
              shell.navigation.navigateTo(
                'dedicated',
                `#/cluster/${item.id}`,
                {},
              );
            }}
            label={t(item.iam.displayName)}
          ></OdsLink>
        </div>
      ),
    },
    {
      id: 'model',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_model'),
      header: t('dedicated_clusters_model'),
      cell: ({ row: { original: item } }) => <div>{t(item.model)}</div>,
    },
    {
      id: 'region',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_region'),
      header: t('dedicated_clusters_region'),
      cell: ({ row: { original: item } }) => <div>{t(item.region)}</div>,
    },
  ];

  if (isError) {
    return <ErrorComponent error={error as ApiError} />;
  }

  const TopbarCTA = () => (
    <OdsButton
      icon={ODS_ICON_NAME.plus}
      size={ODS_BUTTON_SIZE.sm}
      variant="outline"
      label={tCommon('order')}
      onClick={(e) => {
        window.open(links.threeAZClusterOrder);
        e.preventDefault();
      }}
    />
  );

  return (
    <>
      {isError && <ErrorComponent error={error as ApiError} />}
      {!isError && (
        <RedirectionGuard
          isLoading={isLoading || !flattenData}
          condition={flattenData && flattenData?.length === 0}
          route={urls.onboarding}
        >
          <React.Suspense>
            {columns && (
              <Datagrid
                columns={clusterColumns}
                data={sortClusterListing(
                  sorting,
                  (flattenData as unknown) as Cluster[],
                )}
                totalCount={totalCount || 0}
                hasNextPage={hasNextPage && !isLoading}
                onFetchNextPage={fetchNextPage}
                sorting={{ sorting, setSorting }}
                isLoading={isLoading}
                filters={filters}
                search={search}
                topbar={<TopbarCTA />}
              />
            )}
          </React.Suspense>
        </RedirectionGuard>
      )}
    </>
  );
}

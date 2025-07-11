import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  Datagrid,
  DataGridTextCell,
  ErrorBanner,
  useResourcesIcebergV6,
  DatagridColumn,
  ColumnSort,
  useDataGrid,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
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
  const { sorting, setSorting } = useDataGrid({
    id: 'iam.displayName',
    desc: false,
  });
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
  } = useResourcesIcebergV6<Cluster[]>({
    columns,
    route: `/dedicated/cluster`,
    queryKey: ['dedicated-servers', `/dedicated/cluster`],
  });

  const sortClusterListing = (
    cluSorting: ColumnSort,
    originalList: Cluster[] = [],
  ) => {
    const clusterList = [...originalList];
    clusterList.sort((item1, item2) => {
      switch (cluSorting?.id) {
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

    return cluSorting?.desc ? clusterList.reverse() : clusterList;
  };

  const clusterColumns: DatagridColumn<Cluster>[] = [
    {
      id: 'iam.displayName',
      isSearchable: true,
      isFilterable: true,
      enableHiding: false,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_name'),
      cell: (item: Cluster) => (
        <DataGridTextCell>
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
        </DataGridTextCell>
      ),
    },
    {
      id: 'model',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_model'),
      cell: (item: Cluster) => (
        <DataGridTextCell>{t(item.model)}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_region'),
      cell: (item: Cluster) => (
        <DataGridTextCell>{t(item.region)}</DataGridTextCell>
      ),
    },
  ];

  if (isError) {
    const { response }: any = error;
    const errorObj = {
      data: error,
      headers: response.headers,
      status: response.status,
    };
    return <ErrorBanner error={errorObj} />;
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
          condition={isSuccess && flattenData?.length === 0}
          route={urls.onboarding}
          isError={isError}
        >
          <React.Suspense>
            {columns && (
              <Datagrid
                columns={clusterColumns}
                items={sortClusterListing(
                  sorting,
                  (flattenData as unknown) as Cluster[],
                )}
                totalItems={totalCount || 0}
                hasNextPage={hasNextPage && !isLoading}
                onFetchNextPage={fetchNextPage}
                sorting={sorting}
                onSortChange={setSorting}
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

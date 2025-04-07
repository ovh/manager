import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
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
} from '@ovh-ux/manager-react-components';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import useLinkUtils, { UrlEntry } from '@/hooks/useLinkUtils';
import { orderLinks } from '@/data/constants/orderLinks';
import { ClusterWithIAM } from '@/data/types/cluster.type';

export default function Listing() {
  const [columns] = useState([]);
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('cluster');
  const links = useLinkUtils<UrlEntry>(orderLinks);
  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
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
    search,
    filters,
  } = useResourcesIcebergV6<ClusterWithIAM[]>({
    columns,
    route: `/dedicated/cluster`,
    queryKey: ['dedicated-servers', `/dedicated/cluster`],
  });

  const sortClusterListing = (
    cluSorting: ColumnSort,
    originalList: ClusterWithIAM[] = [],
  ) => {
    const clusterList = [...originalList];
    clusterList.sort((item1, item2) => {
      switch (cluSorting?.id) {
        case 'displayName':
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

  const clusterColumns: DatagridColumn<ClusterWithIAM>[] = [
    {
      id: 'name',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('dedicated_clusters_name'),
      cell: (item: ClusterWithIAM) => (
        <DataGridTextCell>
          <OdsLink
            color="primary"
            href={`#/cluster/${item.id}`}
            onClick={() => {
              shell.navigation.navigateTo(
                'dedicated',
                `#/server/${item.id}`,
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
      cell: (item: ClusterWithIAM) => (
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
      cell: (item: ClusterWithIAM) => (
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
    <div>
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        variant="outline"
        label={t('commander')}
        onClick={(e) => {
          shell.navigation.navigateTo(
            'dedicated',
            links.threeAZClusterOrder,
            {},
          );
          e.preventDefault();
        }}
      />
    </div>
  );

  return (
    <React.Suspense>
      {columns && (
        <Datagrid
          columns={clusterColumns}
          items={sortClusterListing(
            sorting,
            (flattenData as unknown) as ClusterWithIAM[],
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
  );
}

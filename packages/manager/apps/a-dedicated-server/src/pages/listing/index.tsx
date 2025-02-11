import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';

import {
  Breadcrumb,
  Datagrid,
  DataGridTextCell,
  ErrorBanner,
  useResourcesIcebergV6,
  BaseLayout,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/a-dedicated-server.config';

export default function Listing() {
  const { t } = useTranslation('listing');
  const columns = useMemo(
    () => [
      {
        id: 'ip',
        label: 'ip',
        isFilterable: true,
        isSearchable: true,
        cell: (props: any) => <DataGridTextCell>{props.ip}</DataGridTextCell>,
        type: FilterTypeCategories.String,
      },
      {
        id: 'os',
        label: 'os',
        isFilterable: true,
        cell: (props: any) => <DataGridTextCell>{props.os}</DataGridTextCell>,
        type: FilterTypeCategories.String,
      },
      {
        id: 'name',
        label: 'name',
        isFilterable: true,
        cell: (props: any) => <DataGridTextCell>{props.name}</DataGridTextCell>,
        type: FilterTypeCategories.String,
      },
      {
        id: 'rack',
        label: 'rack',
        isFilterable: true,
        cell: (props: any) => <DataGridTextCell>{props.rack}</DataGridTextCell>,
        type: FilterTypeCategories.String,
      },
      {
        id: 'state',
        label: 'state',
        isFilterable: true,
        cell: (props: any) => (
          <DataGridTextCell>{props.state}</DataGridTextCell>
        ),
        type: FilterTypeCategories.String,
      },
    ],
    [],
  );
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
    queryKey: ['a-dedicated-server', `/dedicated/server`],
  });

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
        label="Add servers"
      />
    </div>
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={appConfig.rootLabel}
          appName="a-dedicated-server"
        />
      }
      header={{ title: t('title') }}
    >
      <React.Suspense>
        {columns && flattenData && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
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
    </BaseLayout>
  );
}

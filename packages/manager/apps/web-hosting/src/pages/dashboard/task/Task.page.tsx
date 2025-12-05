import React from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { BUTTON_COLOR, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn, useDataApi } from '@ovh-ux/muk';

import Loading from '@/components/loading/Loading.component';
import useDatagridColumn from '@/hooks/task/useDatagridColumn';

export default function Multisite() {
  const { serviceName } = useParams();
  const queryClient = useQueryClient();

  const columns = useDatagridColumn();

  const { flattenData, hasNextPage, fetchNextPage, isLoading } = useDataApi({
    version: 'v6',
    route: `/hosting/web/${serviceName}/tasks`,
    cacheKey: ['hosting', 'web', serviceName, 'tasks'],
    enabled: !!serviceName,
    iceberg: true,
  });
  return (
    <React.Suspense fallback={<Loading />}>
      <div className="mb-6 flex flex-wrap justify-end">
        <Button
          variant={BUTTON_VARIANT.outline}
          color={BUTTON_COLOR.primary}
          onClick={() => {
            queryClient
              .invalidateQueries({
                queryKey: ['hosting', 'web', serviceName, 'tasks'],
              })
              .catch(console.error);
          }}
        >
          <Icon name={ICON_NAME.refresh}></Icon>
        </Button>
      </div>
      <Datagrid
        columns={columns as DatagridColumn<Record<string, unknown>>[]}
        data={flattenData ?? []}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        isLoading={isLoading}
      />
    </React.Suspense>
  );
}

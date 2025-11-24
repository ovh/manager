import React from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { BUTTON_COLOR, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { Datagrid, useDataApi } from '@ovh-ux/muk';

import Loading from '@/components/loading/Loading.component';
import { TaskDetailsType } from '@/data/types/product/webHosting';
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
      <div className="flex flex-wrap justify-end mb-6">
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
        columns={flattenData ? columns : []}
        data={flattenData?.map((item) => item as TaskDetailsType) || []}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        isLoading={isLoading}
      />
    </React.Suspense>
  );
}

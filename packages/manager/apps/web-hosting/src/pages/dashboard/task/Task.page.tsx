import React from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { Datagrid, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

import Loading from '@/components/loading/Loading.component';
import useDatagridColumn from '@/hooks/task/useDatagridColumn';

export default function Multisite() {
  const { serviceName } = useParams();
  const queryClient = useQueryClient();

  const columns = useDatagridColumn();

  const { flattenData, hasNextPage, fetchNextPage, isLoading } = useResourcesIcebergV6({
    route: `/hosting/web/${serviceName}/tasks`,
    queryKey: ['hosting', 'web', serviceName, 'tasks'],
  });
  return (
    <React.Suspense fallback={<Loading />}>
      <div className="flex flex-wrap justify-end mb-6">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          label=""
          icon={ODS_ICON_NAME.refresh}
          onClick={() => {
            queryClient
              .invalidateQueries({
                queryKey: ['hosting', 'web', serviceName, 'tasks'],
              })
              .catch(console.error);
          }}
        />
      </div>
      {columns && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={flattenData?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}

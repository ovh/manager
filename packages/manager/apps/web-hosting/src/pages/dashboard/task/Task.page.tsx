import React from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useGetTaskDetails } from '@/data/hooks/webHostingTask/useWebHostingTask';
import useDatagridColumn from '@/hooks/task/useDatagridColumn';
import Loading from '@/components/loading/Loading.component';

export default function Multisite() {
  const { serviceName } = useParams();
  const queryClient = useQueryClient();

  const columns = useDatagridColumn();
  const { data, isLoading, fetchNextPage, hasNextPage } = useGetTaskDetails(
    serviceName,
  );

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="flex flex-wrap justify-end mb-6">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          label=""
          icon={ODS_ICON_NAME.refresh}
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ['hosting', 'web', serviceName, 'tasks'],
            });
          }}
        />
      </div>
      {columns && (
        <Datagrid
          columns={columns}
          items={data || []}
          totalItems={data?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}

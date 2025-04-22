import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Datagrid,
  Notifications,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';
import Loading from '@/components/loading/Loading.component';
import Topbar from '@/components/topBar/TopBar.component';

export default function Ssl() {
  const { serviceName } = useParams();
  const queryClient = useQueryClient();
  const {
    flattenData,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useResourcesIcebergV6({
    route: `/hosting/web/${serviceName}/attachedDomain`,
    queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
  });

  const columns = useDatagridColumn();

  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
      <Topbar />
      <div className="flex justify-end mb-7 ">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          label=""
          icon={ODS_ICON_NAME.refresh}
          onClick={() => {
            queryClient.invalidateQueries();
          }}
        />
      </div>
      {columns && (
        <Datagrid
          columns={columns}
          items={flattenData || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Datagrid,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';

import Topbar from './TopBar.component';
import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';
import { DomainDetails } from '@/types/ssl';
import queryClient from '@/queryClient';

export default function Ssl() {
  const { serviceName } = useParams();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState({ status: null, label: '' });

  const {
    flattenData,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useResourcesIcebergV6({
    route: `/hosting/web/${serviceName}/attachedDomain`,
    queryKey: [],
  });

  useEffect(() => {
    const data = flattenData?.map((item: DomainDetails) => {
      return {
        ...item,
        setMessage,
      };
    });
    setItems(data ?? []);
  }, [flattenData]);

  const columns = useDatagridColumn();

  return (
    <React.Suspense>
      {message?.status && (
        <div className="w-full mb-10">
          <OdsMessage
            isDismissible
            onOdsRemove={() => {
              setMessage({ status: null, label: '' });
            }}
            color={
              message?.status === 'success'
                ? ODS_MESSAGE_COLOR.success
                : ODS_MESSAGE_COLOR.warning
            }
          >
            {message?.label}
          </OdsMessage>
        </div>
      )}
      <Topbar setMessage={setMessage} />
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
          items={items || []}
          totalItems={totalCount || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </React.Suspense>
  );
}

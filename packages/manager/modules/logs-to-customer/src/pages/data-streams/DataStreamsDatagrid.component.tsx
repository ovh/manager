import React, { useContext, useMemo } from 'react';

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Popover,
  Spinner,
} from '@ovhcloud/ods-react';

import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  DatagridColumn,
  FilterAdd,
  FilterList,
  useDataApi,
} from '@ovh-ux/muk';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import ApiError from '@/components/apiError/ApiError.component';
import DataStreamActions from '@/components/data-streams/DataStreamActions.component';
import DataStreamIndexingStatus from '@/components/data-streams/DataStreamIndexingStatus.component';
import DataStreamRetention from '@/components/data-streams/DataStreamRetention.component';
import DataStreamSubscriptionsLink from '@/components/data-streams/DataStreamSubscriptionsLink.component';
import { Service, Stream } from '@/data/types/dbaas/logs';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';
import { getLogStreamsQueryKey } from '@/data/hooks/useLogStream';
import { NAMESPACES } from '@/LogsToCustomer.translations';

const STREAM_LIST_COLUMN_ID = {
  title: 'title',
  description: 'description',
  indexation: 'indexation',
  retention: 'retention',
  subscription: 'subscription',
  actions: 'actions',
};

const DataStreamsDatagrid = ({ service: { serviceName } }: { service: Service }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const addDatastreamLogsAccess = useLogTrackingActions(
    LogsActionEnum.add_datastream_logs_access,
  );

  const queryKey = [getLogStreamsQueryKey()[0] as string, serviceName];

  // FIXME:  Use React Query directly to avoid useDataApi issues
  // switch to useDataApi from MUK when infinite loop is fixed
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [getLogStreamsQueryKey()[0] as string, serviceName],
    queryFn: () => fetchIcebergV6<Stream>({ route: `/dbaas/logs/${serviceName}/output/graylog/stream` }),
  });

  const flattenData = useMemo(() => data?.data || [], [data]);

  // Define columns before early returns to maintain hooks order
  const columns: DatagridColumn<Stream>[] = useMemo(() => [
    {
      id: STREAM_LIST_COLUMN_ID.title,
      accessorKey: 'title',
      header: t('log_streams_colomn_name'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.description,
      accessorKey: 'description',
      header: t('log_streams_colomn_description'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.indexation,
      cell: ({ row }) => (
        <DataStreamIndexingStatus indexingEnabled={row.original.indexingEnabled} />
      ),
      header: t('log_streams_colomn_indexation'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.retention,
      cell: ({ row }) => (
        <DataStreamRetention
          retentionId={row.original.retentionId}
          clusterId={row.original.clusterId}
          serviceName={serviceName}
        />
      ),
      header: t('log_streams_colomn_retention'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.subscription,
      cell: ({ row }) => (
        <DataStreamSubscriptionsLink
          nbSubscription={row.original.nbSubscription}
          streamId={row.original.streamId}
          serviceName={serviceName}
          parentStreamId={row.original.parentStreamId}
        />
      ),
      header: t('log_streams_colomn_subscriptions'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.actions,
      cell: ({ row }) => <DataStreamActions stream={row.original} />,
      header: '',
      isSortable: false,
    },
  ], [t, serviceName]);

  if (isLoading)
    return (
      <div className="flex py-8">
        <Spinner size="md" data-testid="logKinds-spinner" />
      </div>
    );

  if (isError)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          void queryClient.refetchQueries({
            queryKey,
          })
        }
      />
    );

  return (
    <div className="flex flex-col gap-3">
      <Datagrid<Stream>
        topbar={
          <Button
            size="sm"
            onClick={() => {
              trackClick({
                location: PageLocation.datagrid,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: [addDatastreamLogsAccess],
              });
              navigation
                .getURL(
                  'dedicated',
                  `#/dbaas/logs/${serviceName}/streams/add`,
                  {},
                )
                .then((url) => window.open(url as string, '_blank'));
            }}
          >
            {t('log_streams_add_stream')}
          </Button>
        }
        columns={columns}
        data={flattenData}
        // hasNextPage={hasNextPage && !isLoading}
        // onFetchNextPage={fetchNextPage}
        // filters={filters}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DataStreamsDatagrid;

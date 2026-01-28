import React, { useContext, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Button,
  BUTTON_VARIANT,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@ovhcloud/ods-react';

import {
  Datagrid,
  DatagridColumn,
  useColumnFilters,
  useDataApi,
} from '@ovh-ux/muk';
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
import { applyFilters, FilterTypeCategories } from '@ovh-ux/manager-core-api';

const STREAM_LIST_COLUMN_ID = {
  title: 'title',
  description: 'description',
  indexation: 'indexation',
  retention: 'retention',
  subscription: 'subscription',
  actions: 'actions',
};

const logStreamsQueryKey = getLogStreamsQueryKey()[0] as string;

const DataStreamsDatagrid = ({ service }: { service: Service }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const addDatastreamLogsAccess = useLogTrackingActions(
    LogsActionEnum.add_datastream_logs_access,
  );

  const {
    flattenData,
    error,
    isError,
    isLoading,
  } = useDataApi<Stream>({
    route: `/dbaas/logs/${service.serviceName}/output/graylog/stream`,
    cacheKey: [logStreamsQueryKey, service.serviceName],
    version: 'v6',
    disableCache: true,
    iceberg: true,
    enabled: !!service.serviceName,
  });

  const {filters, addFilter: add, removeFilter: remove } = useColumnFilters();
  const filtersProps = useMemo(() => ({ filters, add, remove }), [filters, add, remove]);

  const filteredData = useMemo(
    () => applyFilters(flattenData || [], filters),
    [flattenData, filters],
  );

  if (isLoading)
    return (
      <div className="flex py-8">
        <Spinner size="md" data-testid="logKinds-spinner" />
      </div>
    );

  if (isError && error)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          void queryClient.refetchQueries({
            queryKey: [logStreamsQueryKey, service.serviceName],
          })
        }
      />
    );

  const columns: DatagridColumn<Stream>[] = [
    {
      id: STREAM_LIST_COLUMN_ID.title,
      accessorKey: 'title',
      header: t('log_streams_colomn_name'),
      label: t('log_streams_colomn_name'),
      isSortable: false,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: STREAM_LIST_COLUMN_ID.description,
      accessorKey: 'description',
      header: t('log_streams_colomn_description'),
      label: t('log_streams_colomn_description'),
      isSortable: false,
      isFilterable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: STREAM_LIST_COLUMN_ID.indexation,
      cell: (info) => (
        <DataStreamIndexingStatus indexingEnabled={info.row.original.indexingEnabled} />
      ),
      header: t('log_streams_colomn_indexation'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.retention,
      cell: (info) => (
        <DataStreamRetention
          retentionId={info.row.original.retentionId}
          clusterId={info.row.original.clusterId}
          serviceName={service.serviceName}
        />
      ),
      header: t('log_streams_colomn_retention'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.subscription,
      cell: (info) => (
        <DataStreamSubscriptionsLink
          nbSubscription={info.row.original.nbSubscription}
          streamId={info.row.original.streamId}
          serviceName={service.serviceName}
          parentStreamId={info.row.original.parentStreamId}
        />
      ),
      header: t('log_streams_colomn_subscriptions'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.actions,
      accessorFn: () => null,
      cell: (info) => <DataStreamActions stream={info.row.original} />,
      header: '',
      isSortable: false,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Datagrid<Stream>
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        filters={filtersProps}
        containerHeight={725} //TOFIX: waiting muk fixes
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
                  `#/dbaas/logs/${service.serviceName}/streams/add`,
                  {},
                )
                .then((url) => window.open(url as string, '_blank'));
            }}
          >
            {t('log_streams_add_stream')}
          </Button>
        }
      />
    </div>
  );
};

export default DataStreamsDatagrid;

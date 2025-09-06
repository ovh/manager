import React, { useContext } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsPopover, OdsSpinner } from '@ovhcloud/ods-components/react';

import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  DatagridColumn,
  FilterAdd,
  FilterList,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import ApiError from '../../components/apiError/ApiError.component';
import DataStreamActions from '../../components/data-streams/DataStreamActions.component';
import DataStreamIndexingStatus from '../../components/data-streams/DataStreamIndexingStatus.component';
import DataStreamRetention from '../../components/data-streams/DataStreamRetention.component';
import DataStreamSubscriptionsLink from '../../components/data-streams/DataStreamSubscriptionsLink.component';
import { Service, Stream } from '../../data/types/dbaas/logs';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';

const STREAM_LIST_COLUMN_ID = {
  title: 'title',
  description: 'description',
  indexation: 'indexation',
  retention: 'retention',
  subscription: 'subscription',
  actions: 'actions',
};

const DataStreamsDatagrid = ({ service }: { service: Service }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('logStreams');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const addDatastreamLogsAccess = useLogTrackingActions(LogsActionEnum.add_datastream_logs_access);

  const {
    flattenData,
    error,
    isError,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    filters,
  } = useResourcesIcebergV6<Stream>({
    route: `/dbaas/logs/${service.serviceName}/output/graylog/stream`,
    queryKey: ['getLogStreams', service.serviceName],
    disableCache: true,
  });

  if (isLoading)
    return (
      <div className="flex py-8">
        <OdsSpinner size="md" data-testid="logKinds-spinner" />
      </div>
    );

  if (isError)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          void queryClient.refetchQueries({
            queryKey: ['getLogStreams', service.serviceName],
          })
        }
      />
    );

  const columns: DatagridColumn<Stream>[] = [
    {
      id: STREAM_LIST_COLUMN_ID.title,
      cell: (stream) => <div>{stream.title}</div>,
      label: t('log_streams_colomn_name'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.description,
      cell: (stream) => <div>{stream.description}</div>,
      label: t('log_streams_colomn_description'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.indexation,
      cell: (stream) => <DataStreamIndexingStatus indexingEnabled={stream.indexingEnabled} />,
      label: t('log_streams_colomn_indexation'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.retention,
      cell: (stream) => (
        <DataStreamRetention
          retentionId={stream.retentionId}
          clusterId={stream.clusterId}
          serviceName={service.serviceName}
        />
      ),
      label: t('log_streams_colomn_retention'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.subscription,
      cell: (stream) => (
        <DataStreamSubscriptionsLink
          nbSubscription={stream.nbSubscription}
          streamId={stream.streamId}
          serviceName={service.serviceName}
          parentStreamId={stream.parentStreamId}
        />
      ),
      label: t('log_streams_colomn_subscriptions'),
      isSortable: false,
    },
    {
      id: STREAM_LIST_COLUMN_ID.actions,
      cell: (stream) => <DataStreamActions stream={stream} />,
      label: '',
      isSortable: false,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <OdsButton
          size="sm"
          onClick={() => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [addDatastreamLogsAccess],
            });
            navigation
              .getURL('dedicated', `#/dbaas/logs/${service.serviceName}/streams/add`, {})
              .then((url) => window.open(url as string, '_blank'));
          }}
          label={t('log_streams_add_stream')}
        />
        <OdsButton
          variant="outline"
          size="sm"
          label={t('log_streams_filter')}
          id="trigger-filter-popover"
        ></OdsButton>
        <OdsPopover triggerId={'trigger-filter-popover'}>
          <FilterAdd
            columns={[
              {
                id: STREAM_LIST_COLUMN_ID.title,
                label: t('log_streams_colomn_name'),
                comparators: FilterCategories.String,
              },
            ]}
            onAddFilter={(addedFilter, column) => {
              filters.add({
                ...addedFilter,
                label: column.label,
              });
            }}
          />
        </OdsPopover>
      </div>
      <FilterList filters={filters.filters} onRemoveFilter={filters.remove} />
      <Datagrid
        columns={columns}
        items={flattenData}
        totalItems={totalCount || 0}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={fetchNextPage}
        noResultLabel={t('log_streams_no_results')}
      />
    </div>
  );
};

export default DataStreamsDatagrid;

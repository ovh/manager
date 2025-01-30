import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useQueryClient } from '@tanstack/react-query';
import ApiError from '../../components/apiError/ApiError.component';
import {
  getLogStreamsQueryKey,
  useLogStreams,
} from '../../data/hooks/useLogStream';
import { Service, Stream } from '../../data/types/dbaas/logs';
import DataStreamIndexingStatus from '../../components/data-streams/DataStreamIndexingStatus.component';
import DataStreamRetention from '../../components/data-streams/DataStreamRetention.component';
import DataStreamSubscriptionsLink from '../../components/data-streams/DataStreamSubscriptionsLink.component';
import DataStreamActions from '../../components/data-streams/DataStreamActions.component';
import DataStreamAccountLink from '../../components/data-streams/DataStreamAccountLink.component';

const STREAM_LIST_COLUMN_ID = {
  title: 'title',
  service: 'service',
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

  const { pagination, setPagination } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { data: streams, isPending, error } = useLogStreams(
    service.serviceName,
    pagination,
    filters,
  );

  if (isPending)
    return (
      <div className="flex py-8">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logKinds-spinner"
        />
      </div>
    );

  if (error)
    return (
      <ApiError
        testId="logKinds-error"
        error={error}
        onRetry={() =>
          queryClient.refetchQueries({
            queryKey: getLogStreamsQueryKey(
              service.serviceName,
              pagination,
              filters,
            ),
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
      id: STREAM_LIST_COLUMN_ID.service,
      cell: () => <DataStreamAccountLink service={service} />,
      label: t('log_streams_colomn_account'),
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
      cell: (stream) => (
        <DataStreamIndexingStatus
          indexingEnabled={stream.indexingEnabled}
          inline
        />
      ),
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
    <>
      <div className="flex justify-between">
        <OsdsButton
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            navigation
              .getURL(
                'dedicated',
                `#/dbaas/logs/${service.serviceName}/streams/add`,
                {},
              )
              .then((url: string) => window.open(url, '_blank'));
          }}
        >
          {t('log_streams_add_stream')}
        </OsdsButton>
        <OsdsPopover>
          <span slot="popover-trigger">
            <OsdsButton
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
            >
              {t('log_streams_filter')}
            </OsdsButton>
          </span>

          <OsdsPopoverContent>
            <FilterAdd
              columns={[
                {
                  id: STREAM_LIST_COLUMN_ID.title,
                  label: t('log_streams_colomn_name'),
                  comparators: FilterCategories.String,
                },
              ]}
              onAddFilter={(addedFilter, column) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  ...addedFilter,
                  label: column.label,
                });
              }}
            />
          </OsdsPopoverContent>
        </OsdsPopover>
      </div>
      <div>
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      <Datagrid
        columns={columns}
        items={streams}
        totalItems={streams.length || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </>
  );
};

export default DataStreamsDatagrid;

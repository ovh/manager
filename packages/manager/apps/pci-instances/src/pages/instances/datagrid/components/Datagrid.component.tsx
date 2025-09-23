import {
  Datagrid,
  DatagridColumn,
  useNotifications,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { Filter } from '@ovh-ux/manager-core-api';
import { usePciUrl } from '@ovh-ux/manager-pci-common';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { NameIdCell } from '@/pages/instances/datagrid/components/cell/NameIdCell.component';
import { useInstances } from '@/data/hooks/instance/useInstances';
import { ActionsCell } from '@/pages/instances/datagrid/components/cell/ActionsCell.component';
import { ListCell } from '@/pages/instances/datagrid/components/cell/ListCell.component';
import { mapAddressesToListItems } from '@/pages/instances/mapper';
import { DeepReadonly } from '@/types/utils.type';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { useDatagridPolling } from '../hooks/useDatagridPolling';
import { TextCell } from '@/pages/instances/datagrid/components/cell/TextCell.component';
import { TaskStatus } from '../../task/TaskStatus.component';
import { useFormatDate } from '@/hooks/date/useFormatDate';
import { useInstancesOperationsPolling } from '@/data/hooks/instance/polling/useInstancesPolling';

type TFilterWithLabel = Filter & { label: string };
type TSorting = {
  id: string;
  desc: boolean;
};

type TDatagridComponentProps = DeepReadonly<{
  sorting: TSorting;
  filters: TFilterWithLabel[];
  onRefresh: () => void;
  onSortChange: Dispatch<SetStateAction<TSorting>>;
}>;

const getPlaceHolderData = (count: number): TAggregatedInstance[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  [...new Array(count)].map((_elt, index) => ({
    id: String(index),
    name: '',
    flavorId: '',
    flavorName: '',
    status: {
      label: 'ACTIVE',
      severity: 'success',
    },
    region: '',
    imageId: '',
    imageName: '',
    addresses: new Map(),
    volumes: [],
    pendingTask: false,
    actions: new Map(),
    availabilityZone: null,
    taskState: null,
    isImageDeprecated: false,
    creationDate: null,
  }));

const DatagridComponent = ({
  sorting,
  filters,
  onRefresh,
  onSortChange,
}: TDatagridComponentProps) => {
  const pciUrl = usePciUrl();
  const { t } = useTranslation([
    'list',
    'common',
    'actions',
    NAMESPACES.STATUS,
    NAMESPACES.REGION,
  ]);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const {
    addWarning,
    clearNotifications,
    notifications,
    addError,
  } = useNotifications();

  const { hasOperationsRunning } = useInstancesOperationsPolling();

  const {
    data = getPlaceHolderData(10),
    isLoading: instancesQueryLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasInconsistency,
    isFetching,
    isRefetching,
    isError,
    pendingTasks,
  } = useInstances({
    limit: 20,
    sort: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    filters,
    forceRefetch: hasOperationsRunning,
  });

  const pollingData = useDatagridPolling(pendingTasks);

  const { formatDate } = useFormatDate({
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const datagridColumns: DatagridColumn<TAggregatedInstance>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (instance) => (
          <NameIdCell isLoading={instancesQueryLoading} instance={instance} />
        ),
        label: t('pci_instances_list_column_nameId'),
        isSortable: true,
      },
      {
        id: 'region',
        cell: (instance) => {
          const { availabilityZone } = instance;
          const formattedRegion =
            availabilityZone !== null
              ? availabilityZone
              : translateMicroRegion(instance.region);
          return (
            <TextCell
              isLoading={instancesQueryLoading}
              label={formattedRegion}
            />
          );
        },
        label: t(`${NAMESPACES.REGION}:localisation`),
        isSortable: false,
      },
      {
        id: 'flavor',
        cell: (instance) => (
          <TextCell
            isLoading={instancesQueryLoading}
            label={instance.flavorName}
          />
        ),
        label: t('pci_instances_list_column_flavor'),
        isSortable: true,
      },
      {
        id: 'image',
        cell: (instance) => (
          <TextCell
            isLoading={instancesQueryLoading}
            label={instance.imageName}
          />
        ),
        label: t('pci_instances_list_column_image'),
        isSortable: true,
      },
      {
        id: 'creationDate',
        cell: (instance) => (
          <TextCell
            isLoading={instancesQueryLoading}
            label={
              instance.creationDate ? formatDate(instance.creationDate) : ''
            }
          />
        ),
        label: t('pci_instances_list_column_creation_date'),
        isSortable: true,
      },
      {
        id: 'publicIPs',
        cell: (instance) => {
          const publicIps = mapAddressesToListItems(
            instance.addresses.get('public'),
          );
          const floatingIps = mapAddressesToListItems(
            instance.addresses.get('floating'),
          ).map((i) => ({ ...i, href: `${pciUrl}/public-ips/floating-ips` }));

          const items = [...publicIps, ...floatingIps];
          return <ListCell isLoading={instancesQueryLoading} items={items} />;
        },
        label: t('pci_instances_list_column_public_IPs'),
        isSortable: false,
      },
      {
        id: 'privateIPs',
        cell: (instance) => (
          <ListCell
            isLoading={instancesQueryLoading}
            items={mapAddressesToListItems(instance.addresses.get('private'))}
          />
        ),
        label: t('pci_instances_list_column_private_IPs'),
        isSortable: false,
      },
      {
        id: 'volumes',
        cell: (instance) => (
          <ListCell
            isLoading={instancesQueryLoading}
            items={instance.volumes}
          />
        ),
        label: t('pci_instances_list_column_volumes'),
        isSortable: false,
      },
      {
        id: 'status',
        cell: (instance) => {
          const pollingInstance = pollingData.find((d) => d.id === instance.id);
          const isPolling = !!pollingInstance && pollingInstance.isPolling;

          return (
            <TaskStatus
              isLoading={instancesQueryLoading}
              status={instance.status}
              taskState={instance.taskState}
              isPolling={isPolling}
            />
          );
        },
        label: t(`${NAMESPACES.STATUS}:status`),
        isSortable: false,
      },
      {
        id: 'actions',
        cell: (instance) => (
          <ActionsCell isLoading={instancesQueryLoading} instance={instance} />
        ),
        label: t('pci_instances_list_column_actions'),
        isSortable: false,
      },
    ],
    [
      t,
      instancesQueryLoading,
      translateMicroRegion,
      pciUrl,
      pollingData,
      formatDate,
    ],
  );

  const errorMessage = useMemo(
    () => (
      <>
        <Trans
          t={t}
          i18nKey="pci_instances_list_unknown_error_message1"
          tOptions={{ interpolation: { escapeValue: true } }}
          shouldUnescape
          components={{
            Link: (
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.error}
                onClick={onRefresh}
              />
            ),
          }}
        />
        <br />
        <Trans t={t} i18nKey="pci_instances_list_unknown_error_message2" />
      </>
    ),
    [onRefresh, t],
  );

  useEffect(() => {
    if (hasInconsistency)
      addWarning(
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_instances_list_inconsistency_message')}
        </OsdsText>,
        true,
      );
    return () => {
      clearNotifications();
    };
  }, [addWarning, hasInconsistency, t, clearNotifications]);

  useEffect(() => {
    if (isFetching && notifications.length) clearNotifications();
  }, [clearNotifications, isFetching, notifications.length]);

  useEffect(() => {
    if (isError) addError(errorMessage, true);
  }, [isError, addError, t, errorMessage]);

  const [isInfoMessageOpen, setIsInfoMessageOpen] = useState(true);

  return (
    <div className="overflow-x-hidden mt-8">
      {hasOperationsRunning && isInfoMessageOpen && (
        <Message
          className="mb-4"
          color="information"
          onRemove={() => setIsInfoMessageOpen(false)}
        >
          <MessageIcon name="circle-info" />
          <MessageBody>{t('pci_instances_operations_running')}</MessageBody>
        </Message>
      )}
      <div className="*:overflow-x-scroll">
        <Datagrid
          columns={datagridColumns}
          hasNextPage={!isFetchingNextPage && !isRefetching && hasNextPage}
          items={data}
          onFetchNextPage={fetchNextPage}
          totalItems={data.length}
          sorting={sorting}
          onSortChange={onSortChange}
          manualSorting
          className={
            '[&_osds-table_table_thead_tr_th]:bg-[--ods-color-default-050] [&_osds-table]:mb-8 [&_osds-table]:overflow-x-visible'
          }
        />
      </div>
    </div>
  );
};

export default DatagridComponent;

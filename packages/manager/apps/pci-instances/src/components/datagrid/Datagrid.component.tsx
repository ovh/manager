import {
  Datagrid,
  DatagridColumn,
  useNotifications,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { Filter } from '@ovh-ux/manager-core-api';
import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useQueryClient } from '@tanstack/react-query';
import { TextCell } from './cell/TextCell.component';
import { NameIdCell } from '@/pages/instances/datagrid/cell/NameIdCell.component';
import {
  updateInstanceFromCache,
  useInstances,
} from '@/data/hooks/instance/useInstances';
import { ActionsCell } from '@/pages/instances/datagrid/cell/ActionsCell.component';

import { StatusCell } from '@/pages/instances/datagrid/cell/StatusCell.component';
import { ListCell } from '@/pages/instances/datagrid/cell/ListCell.component';
import { mapAddressesToListItems } from '@/pages/instances/mapper';
import { Spinner } from '../spinner/Spinner.component';
import { DeepReadonly } from '@/types/utils.type';
import { TInstance } from '@/types/instance/entity.type';
import { useInstancesPolling } from '@/data/hooks/instance/polling/useInstancesPolling';
import { TInstanceDto } from '@/types/instance/api.type';
import { useProjectId } from '@/hooks/project/useProjectId';

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

const DatagridComponent = ({
  sorting,
  filters,
  onRefresh,
  onSortChange,
}: TDatagridComponentProps) => {
  const pciUrl = usePciUrl();
  const { t } = useTranslation(['list', 'common']);
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const {
    addWarning,
    clearNotifications,
    notifications,
    addError,
  } = useNotifications();

  const {
    data,
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
    limit: 10,
    sort: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    filters,
  });

  const handlePollingSuccess = (instance?: TInstanceDto) => {
    if (instance && !instance.pendingTask)
      updateInstanceFromCache(queryClient, {
        projectId,
        instance,
      });
  };

  const pollingData = useInstancesPolling(pendingTasks, handlePollingSuccess);

  const datagridColumns: DatagridColumn<TInstance>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (instance) => (
          <NameIdCell isLoading={isRefetching} instance={instance} />
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
          return <TextCell isLoading={isRefetching} label={formattedRegion} />;
        },
        label: t('pci_instances_list_column_region'),
        isSortable: false,
      },
      {
        id: 'flavor',
        cell: (instance) => (
          <TextCell isLoading={isRefetching} label={instance.flavorName} />
        ),
        label: t('pci_instances_list_column_flavor'),
        isSortable: true,
      },
      {
        id: 'image',
        cell: (instance) => (
          <TextCell isLoading={isRefetching} label={instance.imageName} />
        ),
        label: t('pci_instances_list_column_image'),
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
          return <ListCell isLoading={isRefetching} items={items} />;
        },
        label: t('pci_instances_list_column_public_IPs'),
        isSortable: false,
      },
      {
        id: 'privateIPs',
        cell: (instance) => (
          <ListCell
            isLoading={isRefetching}
            items={mapAddressesToListItems(instance.addresses.get('private'))}
          />
        ),
        label: t('pci_instances_list_column_private_IPs'),
        isSortable: false,
      },
      {
        id: 'volumes',
        cell: (instance) => (
          <ListCell isLoading={isRefetching} items={instance.volumes} />
        ),
        label: t('pci_instances_list_column_volumes'),
        isSortable: false,
      },
      {
        id: 'status',
        cell: (instance) => {
          const pollingInstance = pollingData.find((d) => d.id === instance.id);

          return (
            <StatusCell
              isLoading={
                isRefetching || (!!pollingInstance && !pollingInstance.isError)
              }
              instance={instance}
            />
          );
        },
        label: t('pci_instances_list_column_status'),
        isSortable: false,
      },
      {
        id: 'actions',
        cell: (instance) => (
          <ActionsCell isLoading={isRefetching} instance={instance} />
        ),
        label: t('pci_instances_list_column_actions'),
        isSortable: false,
      },
    ],
    [t, isRefetching, translateMicroRegion, pciUrl, pollingData],
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
      addWarning(t('pci_instances_list_inconsistency_message'), true);
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

  if (instancesQueryLoading) return <Spinner />;

  return (
    <div>
      {data && (
        <div className="mt-10">
          <Datagrid
            columns={datagridColumns}
            hasNextPage={!isFetchingNextPage && !isRefetching && hasNextPage}
            items={data}
            onFetchNextPage={fetchNextPage}
            totalItems={data.length}
            sorting={sorting}
            onSortChange={onSortChange}
            manualSorting
            className={'!overflow-x-visible'}
          />
        </div>
      )}
    </div>
  );
};

export default DatagridComponent;

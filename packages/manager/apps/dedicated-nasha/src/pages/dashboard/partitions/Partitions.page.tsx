import React, { useContext, useMemo, useState } from 'react';
import { useOutletContext, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Datagrid } from '@ovh-ux/muk';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Switch,
  SwitchControl,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { Metrics } from '@/components/Metrics';
import { SpaceMeter } from '@/components/SpaceMeter';
import { usePartitionsAapi, useUpdateNasha } from '@/hooks/nasha';
import { preparePartition } from '@/utils/nasha.utils';
import { urls } from '@/routes/Routes.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/nasha.constants';
import type { Nasha, NashaServiceInfo, NashaPartition } from '@/types/nasha.type';

interface DashboardContext {
  nasha: Nasha & { localeDatacenter: string; diskSize: string };
  serviceInfo: NashaServiceInfo;
  serviceName: string;
  canCreatePartitions: boolean;
}

export default function PartitionsPage() {
  const { nasha, serviceInfo, serviceName, canCreatePartitions } =
    useOutletContext<DashboardContext>();
  const { t } = useTranslation(['partitions', 'common']);
  const navigate = useNavigate();
  const { shell, environment } = useContext(ShellContext);

  const [isMonitoredUpdating, setIsMonitoredUpdating] = useState(false);

  const {
    data: partitionsRaw,
    isLoading,
    refetch,
  } = usePartitionsAapi(serviceName);
  const updateNasha = useUpdateNasha(serviceName);

  // Prepare partitions with translations
  const partitions = useMemo(() => {
    if (!partitionsRaw) return [];
    return partitionsRaw.map((p) => preparePartition(p, t));
  }, [partitionsRaw, t]);

  // Build renew URL
  const urlRenew = useMemo(() => {
    const baseUrl = shell?.navigation?.getURL?.('dedicated', '#/billing/autoRenew');
    return `${baseUrl}?selectedType=DEDICATED_NASHA&searchText=${serviceName}`;
  }, [shell, serviceName]);

  const handleMonitoredChange = async (checked: boolean) => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITIONS}::usage-notification::${checked ? 'enable' : 'disable'}`,
      type: 'action',
    });

    setIsMonitoredUpdating(true);
    try {
      await updateNasha.mutateAsync({ monitored: checked });
    } catch (err) {
      // Revert on error - the hook will handle invalidation
    } finally {
      setIsMonitoredUpdating(false);
    }
  };

  const handleRenewClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITIONS}::renew`,
      type: 'action',
    });
  };

  const handleCreateClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITIONS}::create-partition`,
      type: 'action',
    });
    navigate(urls.partitionsCreate(serviceName));
  };

  const handlePartitionClick = (partitionName: string) => {
    navigate(urls.partition(serviceName, partitionName));
  };

  const handleSnapshotsClick = (partitionName: string) => {
    navigate(urls.partitionSnapshots(serviceName, partitionName));
  };

  const handleAccessesClick = (partitionName: string) => {
    navigate(urls.partitionAccesses(serviceName, partitionName));
  };

  const handleEditSizeClick = (partitionName: string) => {
    navigate(urls.partitionsEditSize(serviceName, partitionName));
  };

  const handleZfsOptionsClick = (partitionName: string) => {
    navigate(urls.partitionsZfsOptions(serviceName, partitionName));
  };

  const handleDeleteClick = (partitionName: string) => {
    navigate(urls.partitionsDelete(serviceName, partitionName));
  };

  const columns = useMemo(
    () => [
      {
        id: 'partitionName',
        header: t('partitions:nasha_dashboard_partitions_list_partition_name'),
        accessorKey: 'partitionName',
        cell: ({ row }: { row: { original: NashaPartition } }) => (
          <Button
            variant={BUTTON_VARIANT.ghost}
            color={BUTTON_COLOR.primary}
            onClick={() => handlePartitionClick(row.original.partitionName)}
          >
            {row.original.partitionName}
          </Button>
        ),
      },
      {
        id: 'protocol',
        header: t('partitions:nasha_dashboard_partitions_list_protocol'),
        accessorKey: 'protocol',
      },
      {
        id: 'use',
        header: t('partitions:nasha_dashboard_partitions_list_use'),
        accessorKey: 'use',
        cell: ({ row }: { row: { original: NashaPartition } }) =>
          row.original.use ? (
            <SpaceMeter usage={row.original.use} showHelp={false} />
          ) : (
            '-'
          ),
      },
      {
        id: 'partitionDescription',
        header: t('partitions:nasha_dashboard_partitions_list_description'),
        accessorKey: 'partitionDescription',
        cell: ({ row }: { row: { original: NashaPartition } }) =>
          row.original.partitionDescription || '-',
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: NashaPartition } }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={BUTTON_VARIANT.ghost}
                color={BUTTON_COLOR.neutral}
                aria-label="Actions"
              >
                <Icon name={ICON_NAME.ellipsisVertical} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col">
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.neutral}
                  onClick={() => handlePartitionClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_show')}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.neutral}
                  onClick={() => handleSnapshotsClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_snapshots')}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.neutral}
                  onClick={() => handleAccessesClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_access')}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.neutral}
                  onClick={() => handleEditSizeClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_edit_size')}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.neutral}
                  onClick={() => handleZfsOptionsClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_zfs_options')}
                </Button>
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  color={BUTTON_COLOR.critical}
                  onClick={() => handleDeleteClick(row.original.partitionName)}
                  className="justify-start"
                >
                  {t('partitions:nasha_dashboard_partitions_action_delete')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ),
      },
    ],
    [t, serviceName],
  );

  return (
    <div className="py-4">
      {/* Metrics Section */}
      <Text preset={TEXT_PRESET.heading4} className="mb-4">
        {t('partitions:nasha_dashboard_partitions_metrics')}
      </Text>
      <Metrics
        nasha={nasha}
        serviceInfo={serviceInfo}
        urlRenew={urlRenew}
        onRenewClick={handleRenewClick}
        monitoredDisabled={isMonitoredUpdating}
        onMonitoredChanged={handleMonitoredChange}
      />

      {/* Partitions Section */}
      <Text preset={TEXT_PRESET.heading4} className="mb-4">
        {t('partitions:nasha_dashboard_partitions_title')}
      </Text>

      <div className="mb-4">
        <Button
          color={BUTTON_COLOR.primary}
          disabled={!canCreatePartitions}
          onClick={handleCreateClick}
        >
          <Icon name={ICON_NAME.plus} className="mr-2" />
          {t('partitions:nasha_dashboard_partitions_create')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <Datagrid
          columns={columns}
          data={partitions}
          totalCount={partitions.length}
        />
      )}

      {/* Outlet for modals */}
      <Outlet context={{ nasha, serviceInfo, serviceName, canCreatePartitions, partitions }} />
    </div>
  );
}


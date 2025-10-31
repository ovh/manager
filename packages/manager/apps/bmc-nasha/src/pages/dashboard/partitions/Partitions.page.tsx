import { useParams, useNavigate } from 'react-router-dom';
import {
  BaseLayout,
  Button,
  Datagrid,
  DatagridColumn,
  ActionMenu,
  ICON_NAME,
  Icon,
} from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { usePartitions } from '@/data/api/hooks/usePartitions';
import { useNashaDetail, useServiceInfo, useCanCreatePartitions } from '@/data/api/hooks/useNashaDetail';
import { useUpdateNashaMonitored } from '@/data/api/hooks/useUpdateNasha';
import { Metrics } from '@/components/metrics/Metrics.component';
import { SpaceMeter } from '@/components/space-meter/SpaceMeter.component';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';
import type { PartitionPrepared } from '@/types/Dashboard.type';

export default function PartitionsPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: nasha } = useNashaDetail(serviceName || '');
  const { data: serviceInfo } = useServiceInfo(serviceName || '');
  const { canCreatePartitions } = useCanCreatePartitions(
    serviceName || '',
    typeof nasha?.zpoolSize === 'number' ? nasha.zpoolSize : undefined,
  );
  const { data: partitionsData, isLoading } = usePartitions(serviceName || '');
  const { mutate: updateMonitored } = useUpdateNashaMonitored(serviceName || '');

  const handleCreatePartition = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'create-partition'] });
    navigate(`/${serviceName}/partitions/create`);
  };

  const handlePartitionClick = (partitionName: string) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'show-partition'] });
    navigate(`/${serviceName}/partitions/${partitionName}`);
  };

  const handleSnapshotsClick = (partitionName: string) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'show-snapshots'] });
    navigate(`/${serviceName}/partitions/${partitionName}/snapshots`);
  };

  const handleAccessesClick = (partitionName: string) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'show-accesses'] });
    navigate(`/${serviceName}/partitions/${partitionName}/accesses`);
  };

  const handleEditSizeClick = (partition: PartitionPrepared) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'edit-size'] });
    navigate(`/${serviceName}/partitions/${partition.partitionName}/edit-size`);
  };

  const handleZfsOptionsClick = (partition: PartitionPrepared) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'zfs-options'] });
    navigate(`/${serviceName}/partitions/${partition.partitionName}/zfs-options`);
  };

  const handleDeleteClick = (partition: PartitionPrepared) => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'delete'] });
    navigate(`/${serviceName}/partitions/${partition.partitionName}/delete`);
  };

  const handleRenewClick = () => {
    // URL will be built from the component
  };

  const getUrlRenew = () => {
    // Build renewal URL - simplified for now
    return `#/billing/autoRenew?selectedType=DEDICATED_NASHA&searchText=${serviceName}`;
  };

  const columns: DatagridColumn<PartitionPrepared>[] = [
    {
      id: 'partitionName',
      accessorKey: 'partitionName',
      header: t('nasha_dashboard_partitions_list_partition_name', { defaultValue: 'Partition name' }),
      cell: ({ row }) => (
        <button
          onClick={() => handlePartitionClick(row.original.partitionName)}
          className="text-blue-600 hover:underline"
        >
          {row.original.partitionName}
        </button>
      ),
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'protocol',
      accessorKey: 'protocol',
      header: t('nasha_dashboard_partitions_list_protocol', { defaultValue: 'Protocol' }),
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'use',
      accessorKey: 'use',
      header: t('nasha_dashboard_partitions_list_use', { defaultValue: 'Usage' }),
      cell: ({ row }) =>
        row.original.use ? <SpaceMeter usage={row.original.use} /> : null,
      enableHiding: false,
    },
    {
      id: 'partitionDescription',
      accessorKey: 'partitionDescription',
      header: t('nasha_dashboard_partitions_list_description', { defaultValue: 'Description' }),
      enableHiding: false,
      isSortable: true,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ActionMenu compact placement="end">
          <ActionMenu.Item onClick={() => handlePartitionClick(row.original.partitionName)}>
            {t('nasha_dashboard_partitions_action_show', { defaultValue: 'Show' })}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => handleSnapshotsClick(row.original.partitionName)}>
            {t('nasha_dashboard_partitions_action_snapshots', { defaultValue: 'Snapshots' })}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => handleAccessesClick(row.original.partitionName)}>
            {t('nasha_dashboard_partitions_action_access', { defaultValue: 'Access' })}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => handleEditSizeClick(row.original)}>
            {t('nasha_dashboard_partitions_action_edit_size', { defaultValue: 'Edit size' })}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => handleZfsOptionsClick(row.original)}>
            {t('nasha_dashboard_partitions_action_zfs_options', { defaultValue: 'ZFS Options' })}
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => handleDeleteClick(row.original)}>
            {t('nasha_dashboard_partitions_action_delete', { defaultValue: 'Delete' })}
          </ActionMenu.Item>
        </ActionMenu>
      ),
      enableHiding: false,
    },
  ];

  return (
    <div className="nasha-dashboard-partitions">
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-4">
            {t('nasha_dashboard_partitions_metrics', { defaultValue: 'Metrics' })}
          </h4>
          {nasha && serviceInfo && (
            <Metrics
              nasha={nasha}
              serviceInfo={serviceInfo}
              urlRenew={getUrlRenew()}
              onRenewClick={handleRenewClick}
              onMonitoredChanged={async (monitored) => {
                await updateMonitored({ monitored });
              }}
            />
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">
            {t('nasha_dashboard_partitions_title', { defaultValue: 'Partitions' })}
          </h4>
          <Datagrid
            columns={columns}
            data={partitionsData?.data || []}
            totalCount={partitionsData?.meta?.totalCount || 0}
            isLoading={isLoading}
            topbar={
              <div className="flex justify-end mb-4">
                <Button
                  variant="default"
                  iconLeft={ICON_NAME.plus}
                  disabled={!canCreatePartitions}
                  onClick={handleCreatePartition}
                >
                  {t('nasha_dashboard_partitions_create', { defaultValue: 'Create partition' })}
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

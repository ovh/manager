import { Suspense, useCallback, useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid, type DatagridColumn } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import Metrics from '@/components/metrics/Metrics.component';
import PartitionActionsCell from '@/components/partitions/PartitionActionsCell.component';
import PartitionNameCell from '@/components/partitions/PartitionNameCell.component';
import SpaceMeter from '@/components/space-meter/SpaceMeter.component';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitions } from '@/hooks/partitions/usePartitions';
import { useUpdateMonitored } from '@/hooks/partitions/useUpdateMonitored';

type PartitionUse = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type Partition = {
  id?: string;
  partitionName: string;
  partitionDescription?: string;
  protocol?: string;
  size: number;
  use?: PartitionUse;
  subRows?: Partition[];
};

export default function PartitionsListPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'partitions']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  // Fetch data
  const { data: partitions, isLoading } = usePartitions(serviceName ?? '');
  const { data: nasha } = useNashaDetail(serviceName ?? '');
  const { canCreatePartitions } = useCanCreatePartitions(serviceName ?? '');
  const updateMonitoredMutation = useUpdateMonitored();

  // Map partitions to add id for ExpandableRow compatibility
  const partitionsWithId = useMemo<Partition[]>(() => {
    if (!Array.isArray(partitions)) return [];
    return partitions.map((partition) => ({
      ...partition,
      id: partition.partitionName,
    }));
  }, [partitions]);

  // Handle monitored change
  const handleMonitoredChange = useCallback(
    (monitored: boolean) => {
      if (!nasha || !serviceName) return;

      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: [
          APP_NAME,
          PREFIX_TRACKING_DASHBOARD_PARTITIONS,
          `usage-notification::${monitored ? 'enable' : 'disable'}`,
        ],
      });

      updateMonitoredMutation.mutate({ serviceName, monitored });
    },
    [nasha, serviceName, trackClick, updateMonitoredMutation],
  );

  // Handle renew click
  const handleRenewClick = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'renew'],
    });
  }, [trackClick]);

  // Handle create partition click
  const handleCreatePartitionClick = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'create-partition'],
    });
    // Navigate to create partition route using relative path
    void navigate('create');
  }, [navigate, trackClick]);

  // Define columns using accessorKey and header as required by MUK Datagrid
  const columns = useMemo<DatagridColumn<Partition>[]>(
    () => [
      {
        accessorKey: 'partitionName',
        header: t('partitions:columns.partition_name'),
        cell: ({ row }) => <PartitionNameCell partitionName={row.original.partitionName} />,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'protocol',
        header: t('partitions:columns.protocol'),
        cell: ({ row }) => row.original.protocol || '-',
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'use',
        header: t('partitions:columns.use'),
        cell: ({ row }) => (row.original.use ? <SpaceMeter usage={row.original.use} /> : '-'),
        enableHiding: true,
      },
      {
        accessorKey: 'partitionDescription',
        header: t('partitions:columns.description'),
        cell: ({ row }) => row.original.partitionDescription || '-',
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <PartitionActionsCell partitionName={row.original.partitionName} />,
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );

  // Topbar CTA button
  const topbarCTA = useMemo(
    () => (
      <Button
        variant="default"
        onClick={handleCreatePartitionClick}
        disabled={!canCreatePartitions}
      >
        {t('partitions:create')}
      </Button>
    ),
    [t, canCreatePartitions, handleCreatePartitionClick],
  );

  return (
    <>
      <div className="nasha-dashboard-partitions">
        <div className="flex flex-col">
          <h4 className="mb-4">{t('partitions:metrics')}</h4>
          {serviceName && (
            <Metrics
              serviceName={serviceName}
              onRenewClick={handleRenewClick}
              onMonitoredChanged={handleMonitoredChange}
            />
          )}
          <h4 className="mb-4">{t('partitions:title')}</h4>
          <Suspense fallback={<div>Loading...</div>}>
            <Datagrid
              columns={columns}
              data={partitionsWithId}
              totalCount={partitionsWithId.length}
              isLoading={isLoading}
              topbar={topbarCTA}
            />
          </Suspense>
        </div>
      </div>
      {/* Outlet for child routes (create, delete, zfs-options) */}
      <Outlet />
    </>
  );
}

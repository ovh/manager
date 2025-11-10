import { Suspense, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { Datagrid, type DatagridColumn, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitions } from '@/hooks/partitions/usePartitions';
import { useUpdateMonitored } from '@/hooks/partitions/useUpdateMonitored';
import { APP_NAME } from '@/Tracking.constants';

import Metrics from '@/components/Metrics/Metrics.component';
import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';
import PartitionNameCell from '@/components/partitions/PartitionNameCell.component';
import PartitionActionsCell from '@/components/partitions/PartitionActionsCell.component';

type Partition = {
  partitionName: string;
  partitionDescription?: string;
  protocol?: string;
  size: number;
  use?: {
    [key: string]: {
      unit: string;
      value: number;
      name?: string;
    };
  };
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

  // Handle monitored change
  const handleMonitoredChange = useCallback(
    async (monitored: boolean) => {
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
    navigate('create');
  }, [trackClick, navigate, serviceName]);


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
        cell: ({ row }) => (
          <PartitionActionsCell partitionName={row.original.partitionName} />
        ),
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
            data={Array.isArray(partitions) ? partitions : []}
            totalCount={Array.isArray(partitions) ? partitions.length : 0}
            isLoading={isLoading}
            topbar={topbarCTA}
            enableSearch
            enableFilter
            enableColumnVisibility
          />
        </Suspense>
      </div>
    </div>
  );
}


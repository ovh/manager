import { Suspense, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Datagrid, type DatagridColumn } from '@ovh-ux/muk';
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
import { urls } from '@/routes/Routes.constants';
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

  // Fetch data
  const { data: partitions, isLoading } = usePartitions(serviceName ?? '');
  const { data: nasha } = useNashaDetail(serviceName ?? '');
  const { canCreatePartitions } = useCanCreatePartitions(serviceName ?? '');

  // Get URLs
  const { data: createPartitionUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/partitions/create`,
    {},
  ]);

  // Handle monitored change
  const handleMonitoredChange = useCallback(async (monitored: boolean) => {
    if (!nasha) return;

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

    // TODO: Implement API call to update monitored status
    // await updateNashaMonitored(serviceName, monitored);
  }, [nasha, trackClick]);

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
    if (createPartitionUrl) {
      window.location.href = createPartitionUrl as string;
    }
  }, [trackClick, createPartitionUrl]);


  // Define columns
  const columns = useMemo<DatagridColumn<Partition>[]>(
    () => [
      {
        id: 'partitionName',
        label: t('partitions:columns.partition_name'),
        cell: ({ partitionName }) => <PartitionNameCell partitionName={partitionName} />,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'protocol',
        label: t('partitions:columns.protocol'),
        cell: ({ protocol }) => protocol || '-',
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'use',
        label: t('partitions:columns.use'),
        cell: ({ use }) => (use ? <SpaceMeter usage={use} /> : '-'),
        enableHiding: true,
      },
      {
        id: 'partitionDescription',
        label: t('partitions:columns.description'),
        cell: ({ partitionDescription }) => partitionDescription || '-',
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'actions',
        label: '',
        cell: (partition: Partition) => (
          <PartitionActionsCell partitionName={partition.partitionName} />
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
      <button
        type="button"
        onClick={handleCreatePartitionClick}
        disabled={!canCreatePartitions}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('partitions:create')}
      </button>
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


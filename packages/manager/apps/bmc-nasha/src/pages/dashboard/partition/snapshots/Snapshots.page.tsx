import { Suspense, useCallback, useMemo } from 'react';

import { useParams, useNavigate, Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Datagrid, type DatagridColumn, Button } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import SnapshotActionsCell from '@/components/partition/snapshots/SnapshotActionsCell.component';
import {
  usePartitionCustomSnapshots,
  usePartitionSnapshotTypes,
} from '@/hooks/partitions/usePartitionSnapshots';

const MAX_CUSTOM_SNAPSHOT = 10;

type SnapshotRow = {
  type: string;
  name: string;
  isCustom: boolean;
};

export default function SnapshotsPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  // Fetch data
  const { data: customSnapshots, isLoading: isCustomSnapshotsLoading } =
    usePartitionCustomSnapshots(serviceName ?? '', partitionName ?? '');
  const { data: snapshotTypes, isLoading: isSnapshotTypesLoading } = usePartitionSnapshotTypes(
    serviceName ?? '',
    partitionName ?? '',
  );

  const isLoading = isCustomSnapshotsLoading || isSnapshotTypesLoading;

  // Combine snapshot types and custom snapshots into rows
  const snapshotRows = useMemo<SnapshotRow[]>(() => {
    const rows: SnapshotRow[] = [];

    // Add snapshot types row
    if (snapshotTypes && snapshotTypes.length > 0) {
      rows.push({
        type: t('partition:snapshots.types', 'Snapshot types'),
        name: snapshotTypes.join(', ') || t('partition:snapshots.no_types', 'None'),
        isCustom: false,
      });
    }

    // Add custom snapshots rows
    if (customSnapshots) {
      customSnapshots.forEach((snapshot) => {
        rows.push({
          type: t('partition:snapshots.custom', 'Custom snapshot'),
          name: snapshot,
          isCustom: true,
        });
      });
    }

    return rows;
  }, [snapshotTypes, customSnapshots, t]);

  // Handle create snapshot
  const handleCreateSnapshot = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create'],
    });
    navigate('create');
  }, [trackClick, navigate]);

  // Define columns using accessorKey and header as required by MUK Datagrid
  const columns = useMemo<DatagridColumn<SnapshotRow>[]>(
    () => [
      {
        accessorKey: 'type',
        header: t('partition:snapshots.columns.type'),
        cell: ({ row }) => row.original.type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'name',
        header: t('partition:snapshots.columns.name'),
        cell: ({ row }) => row.original.name,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => (
          <SnapshotActionsCell snapshotName={row.original.name} isCustom={row.original.isCustom} />
        ),
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );

  const snapshotsCount = `${customSnapshots?.length || 0}/${MAX_CUSTOM_SNAPSHOT}`;
  const canCreateSnapshot = (customSnapshots?.length || 0) < MAX_CUSTOM_SNAPSHOT;

  // Topbar CTA button
  const topbarCTA = useMemo(
    () => (
      <Button variant="default" onClick={handleCreateSnapshot} disabled={!canCreateSnapshot}>
        {t('partition:snapshots.create', 'Create snapshot')}
      </Button>
    ),
    [t, canCreateSnapshot, handleCreateSnapshot],
  );

  return (
    <>
      <BaseLayout
        header={{
          title: t('partition:snapshots.title', 'Snapshot policies'),
          description: t(
            'partition:snapshots.description',
            'Manage snapshot policies for this partition',
          ),
        }}
      >
        <div className="mb-4">
          <p className="font-semibold mb-2">
            {t('partition:snapshots.count_title', 'Custom snapshots count')}
          </p>
          <p>
            {snapshotsCount} ({t('partition:snapshots.count_max', 'max')})
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <Datagrid
            columns={columns}
            data={Array.isArray(snapshotRows) ? snapshotRows : []}
            totalCount={Array.isArray(snapshotRows) ? snapshotRows.length : 0}
            isLoading={isLoading}
            topbar={topbarCTA}
            enableSearch
            enableFilter
            enableColumnVisibility
          />
        </Suspense>
      </BaseLayout>
      {/* Outlet for child routes (create, delete snapshot modals) */}
      <Outlet />
    </>
  );
}

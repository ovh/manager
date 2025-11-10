import { Suspense, useCallback, useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Datagrid, type DatagridColumn } from '@ovh-ux/muk';

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
    // TODO: Implement create snapshot form/modal
  }, [trackClick]);

  // Define columns
  const columns = useMemo<DatagridColumn<SnapshotRow>[]>(
    () => [
      {
        id: 'type',
        label: t('partition:snapshots.columns.type'),
        cell: ({ type }) => type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'name',
        label: t('partition:snapshots.columns.name'),
        cell: ({ name }) => name,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        id: 'actions',
        label: '',
        cell: (row: SnapshotRow) => (
          <SnapshotActionsCell snapshotName={row.name} isCustom={row.isCustom} />
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
      <button
        type="button"
        onClick={handleCreateSnapshot}
        disabled={!canCreateSnapshot}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('partition:snapshots.create', 'Create snapshot')}
      </button>
    ),
    [t, canCreateSnapshot, handleCreateSnapshot],
  );

  return (
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
  );
}

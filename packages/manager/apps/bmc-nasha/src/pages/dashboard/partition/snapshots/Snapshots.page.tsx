import { Suspense, useCallback, useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, Datagrid } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import {
  usePartitionCustomSnapshots,
  usePartitionSnapshotTypes,
} from '@/hooks/partitions/usePartitionSnapshots';
import { useSnapshotsColumns } from '@/hooks/partitions/useSnapshotsColumns';
import { useSnapshotsRows } from '@/hooks/partitions/useSnapshotsRows';

const MAX_CUSTOM_SNAPSHOT = 10;

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
  const snapshotRows = useSnapshotsRows({ snapshotTypes, customSnapshots });
  const columns = useSnapshotsColumns();

  // Handle create snapshot
  const handleCreateSnapshot = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'snapshots', 'create'],
    });
    void navigate('create');
  }, [trackClick, navigate]);

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
        }}
      >
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-4">
            {t('partition:snapshots.description', 'Manage snapshot policies for this partition')}
          </div>
          <p className="font-semibold mb-2">
            {t('partition:snapshots.count_title', 'Custom snapshots count')}
          </p>
          <p>
            {snapshotsCount} ({t('partition:snapshots.count_max', 'max')})
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {}
          {/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
          <Datagrid
            columns={columns as any}
            data={(Array.isArray(snapshotRows) ? snapshotRows : []) as any}
            totalCount={Array.isArray(snapshotRows) ? snapshotRows.length : 0}
            isLoading={isLoading}
            topbar={topbarCTA}
          />
          {/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
        </Suspense>
      </BaseLayout>
      {/* Outlet for child routes (create, delete snapshot modals) */}
      <Outlet />
    </>
  );
}

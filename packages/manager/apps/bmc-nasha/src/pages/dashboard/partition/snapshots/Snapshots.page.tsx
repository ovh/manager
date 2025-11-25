import { Suspense, useCallback, useMemo, useState } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, Checkbox, Datagrid, FormField, FormFieldLabel } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import {
  usePartitionCustomSnapshots,
  usePartitionSnapshotTypes,
} from '@/hooks/partitions/usePartitionSnapshots';
import { useSnapshotsColumns } from '@/hooks/partitions/useSnapshotsColumns';
import { useSnapshotsRows } from '@/hooks/partitions/useSnapshotsRows';
import { useUpdateSnapshotTypes } from '@/hooks/partitions/useUpdateSnapshotTypes';

const MAX_CUSTOM_SNAPSHOT = 10;

// eslint-disable-next-line max-lines-per-function
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

  // Update Snapshot Types
  const { mutateAsync: updateSnapshotTypes, isPending: isUpdatingTypes } = useUpdateSnapshotTypes();

  // Local state for snapshot types editing
  const [editableTypes, setEditableTypes] = useState<typeof snapshotTypes>(snapshotTypes || []);
  const [isEditingTypes, setIsEditingTypes] = useState(false);

  // Check if types have changed
  const hasTypesChanged = useMemo(() => {
    if (!snapshotTypes || !editableTypes) return false;
    return JSON.stringify(snapshotTypes) !== JSON.stringify(editableTypes);
  }, [snapshotTypes, editableTypes]);

  // Handle type toggle
  const handleTypeToggle = useCallback((typeValue: string, enabled: boolean) => {
    setEditableTypes((prev) =>
      prev.map((type) => (type.value === typeValue ? { ...type, enabled } : type)),
    );
  }, []);

  // Handle save types
  const handleSaveTypes = useCallback(async () => {
    if (!serviceName || !partitionName || !snapshotTypes) return;

    try {
      const result = await updateSnapshotTypes({
        serviceName,
        partitionName,
        currentTypes: snapshotTypes,
        newTypes: editableTypes,
      });

      // Navigate to task tracker with multiple tasks
      if (result.taskIds.length > 0) {
        void navigate('../../task-tracker', {
          replace: true,
          state: {
            taskIds: result.taskIds,
            operation: 'clusterLeclercChangeSnapshotType',
            params: { partitionName },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
            trackingData: {
              prefix: `${APP_NAME}::partition::snapshots`,
              hit: 'update-types-close',
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to update snapshot types:', error);
    }
  }, [serviceName, partitionName, snapshotTypes, editableTypes, updateSnapshotTypes, navigate]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditableTypes(snapshotTypes || []);
    setIsEditingTypes(false);
  }, [snapshotTypes]);

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
        </div>

        {/* Snapshot Types Section */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {t('partition:snapshots.types_title', 'Automatic Snapshot Types')}
            </h3>
            {!isEditingTypes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTypes(true)}
                disabled={isLoading}
              >
                {t('partition:snapshots.edit_types', 'Edit')}
              </Button>
            )}
          </div>

          {isEditingTypes ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-3">
                {t(
                  'partition:snapshots.types_description',
                  'Select which automatic snapshot types should be active for this partition',
                )}
              </p>
              {editableTypes.map((type) => (
                <FormField key={type.value}>
                  <Checkbox
                    checked={type.enabled}
                    onChange={(e) =>
                      handleTypeToggle(type.value, (e.target as HTMLInputElement).checked)
                    }
                    disabled={isUpdatingTypes}
                  >
                    <FormFieldLabel>{type.label}</FormFieldLabel>
                  </Checkbox>
                </FormField>
              ))}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  onClick={() => void handleSaveTypes()}
                  disabled={!hasTypesChanged || isUpdatingTypes}
                  loading={isUpdatingTypes}
                >
                  {t('partition:snapshots.save_types', 'Save')}
                </Button>
                <Button variant="ghost" onClick={handleCancelEdit} disabled={isUpdatingTypes}>
                  {t('common:cancel', 'Cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {snapshotTypes?.map((type) => (
                <div key={type.value} className="flex items-center gap-2">
                  <span className={type.enabled ? 'text-green-600' : 'text-gray-400'}>
                    {type.enabled ? '✓' : '✗'}
                  </span>
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Snapshots Section */}
        <div className="mb-4">
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

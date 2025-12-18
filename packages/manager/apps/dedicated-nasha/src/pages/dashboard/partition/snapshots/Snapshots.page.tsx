import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Checkbox,
  FormField,
  Input,
  Message,
  MESSAGE_TYPE,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useNashaPartitionSnapshots,
  useNashaPartitionCustomSnapshots,
  useCreateNashaPartitionSnapshot,
  useDeleteNashaPartitionSnapshot,
} from '@/hooks/nasha/useSnapshots';
import { formatSnapshotEnum } from '@/utils/nasha.utils';
import {
  MAX_CUSTOM_SNAPSHOT,
  CUSTOM_SNAPSHOT_NAME_PATTERN,
  CUSTOM_SNAPSHOT_NAME_PREFIX,
  CUSTOM_SNAPSHOT_NAME_SEPARATOR,
  PREFIX_TRACKING_SNAPSHOT_POLICY,
  NASHA_SNAPSHOT_ENUM,
} from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  nasha: Nasha;
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

interface SnapshotType {
  value: string;
  label: string;
  enabled: boolean;
}

export default function SnapshotsPage() {
  const { partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { t } = useTranslation('partition');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [isFormShown, setIsFormShown] = useState(false);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);
  const [customSnapshotName, setCustomSnapshotName] = useState('');
  const [snapshotTypesModel, setSnapshotTypesModel] = useState<SnapshotType[]>([]);

  const { data: snapshotTypes = [], isLoading: isLoadingSnapshots, refetch: refetchSnapshots } = useNashaPartitionSnapshots(serviceName, partitionName);
  const { data: customSnapshots = [], isLoading: isLoadingCustomSnapshots, refetch: refetchCustomSnapshots } = useNashaPartitionCustomSnapshots(serviceName, partitionName);
  const createSnapshot = useCreateNashaPartitionSnapshot();
  const deleteSnapshot = useDeleteNashaPartitionSnapshot();

  // Initialize snapshot types model
  const initialSnapshotTypes = useMemo<SnapshotType[]>(() => {
    return NASHA_SNAPSHOT_ENUM.map((type) => ({
      value: type,
      label: formatSnapshotEnum(type, t),
      enabled: snapshotTypes.includes(type),
    }));
  }, [snapshotTypes, t]);

  // Reset model when data changes
  useEffect(() => {
    setSnapshotTypesModel(initialSnapshotTypes);
  }, [initialSnapshotTypes]);

  const snapshotsCount = `${customSnapshots.length}/${MAX_CUSTOM_SNAPSHOT} (${t('nasha_dashboard_partition_snapshots_count_max')})`;

  const readableSnapshotTypesModel = useMemo(() => {
    const frequencies = snapshotTypesModel
      .filter(({ enabled }) => enabled)
      .map(({ label }) => label)
      .join(', ');
    return frequencies || t('nasha_dashboard_partition_snapshots_frequencies_placeholder');
  }, [snapshotTypesModel, t]);

  const canUpdateSnapshotTypes = useMemo(() => {
    if (deleteSnapshot.isPending) return false;
    const newTypes = snapshotTypesModel.map(({ enabled }) => enabled).join('');
    const oldTypes = initialSnapshotTypes.map(({ enabled }) => enabled).join('');
    return newTypes !== oldTypes;
  }, [snapshotTypesModel, initialSnapshotTypes, deleteSnapshot.isPending]);

  const isCustomSnapshotNameValid = CUSTOM_SNAPSHOT_NAME_PATTERN.test(customSnapshotName);
  const canCreateCustomSnapshot = isCustomSnapshotNameValid && !createSnapshot.isPending;

  const handleShowForm = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::create-snapshot`,
      type: 'action',
    });
    setIsFormShown(true);
    setCustomSnapshotName(`${partitionName}${CUSTOM_SNAPSHOT_NAME_SEPARATOR}${new Date().toISOString()}`);
  };

  const handleHideForm = () => {
    setIsFormShown(false);
    setCustomSnapshotName('');
  };

  const handleCancelForm = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::cancel-create-snapshot`,
      type: 'action',
    });
    handleHideForm();
  };

  const handleCreateCustomSnapshot = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::confirm-create-snapshot`,
      type: 'action',
    });

    const name = `${CUSTOM_SNAPSHOT_NAME_PREFIX}${CUSTOM_SNAPSHOT_NAME_SEPARATOR}${customSnapshotName}`;

    try {
      await createSnapshot.mutateAsync({
        serviceName,
        partitionName,
        data: { name },
      });
      handleHideForm();
      refetchCustomSnapshots();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleResetSnapshotTypes = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::cancel-update-snapshot-frequencies`,
      type: 'action',
    });
    setSnapshotTypesModel(initialSnapshotTypes);
  };

  const handleUpdateSnapshotTypes = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::confirm-update-snapshot-frequencies`,
      type: 'action',
    });

    const promises: Promise<unknown>[] = [];

    initialSnapshotTypes.forEach((oldType) => {
      const newType = snapshotTypesModel.find(({ value }) => oldType.value === value);
      if (!newType) return;

      if (!oldType.enabled && newType.enabled) {
        promises.push(
          createSnapshot.mutateAsync({
            serviceName,
            partitionName,
            data: { snapshotType: newType.value },
          }),
        );
      }

      if (oldType.enabled && !newType.enabled) {
        promises.push(
          deleteSnapshot.mutateAsync({
            serviceName,
            partitionName,
            snapshotType: newType.value,
          }),
        );
      }
    });

    try {
      await Promise.all(promises);
      refetchSnapshots();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleDeleteClick = (snapshot: string) => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::delete-snapshot`,
      type: 'action',
    });
    navigate(urls.partitionSnapshotDelete(serviceName, partitionName, snapshot));
  };

  const handleToggleSnapshotType = (value: string) => {
    setSnapshotTypesModel((prev) =>
      prev.map((type) =>
        type.value === value ? { ...type, enabled: !type.enabled } : type,
      ),
    );
  };

  const isLoading = isLoadingSnapshots || isLoadingCustomSnapshots;
  const isUpdating = createSnapshot.isPending || deleteSnapshot.isPending;

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-6">
        <Text preset={TEXT_PRESET.heading4} className="mb-2">
          {t('nasha_dashboard_partition_snapshots_heading')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph} className="text-gray-600">
          {t('nasha_dashboard_partition_snapshots_description')}
        </Text>
      </div>

      <Text preset={TEXT_PRESET.heading5} className="mb-4">
        {t('nasha_dashboard_partition_snapshots_subtitle')}
      </Text>

      {/* Snapshots Count */}
      <div className="mb-4">
        <Text preset={TEXT_PRESET.paragraph} className="font-semibold">
          {t('nasha_dashboard_partition_snapshots_count_title')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>{snapshotsCount}</Text>
      </div>

      {/* Create Custom Snapshot Button */}
      <div className="mb-4">
        <Button
          color={BUTTON_COLOR.primary}
          onClick={handleShowForm}
          disabled={isFormShown || customSnapshots.length >= MAX_CUSTOM_SNAPSHOT}
        >
          {t('nasha_dashboard_partition_snapshots_create')}
        </Button>
      </div>

      {/* Warning Message */}
      {isFormShown && !isWarningDismissed && (
        <Message
          type={MESSAGE_TYPE.warning}
          className="mb-4"
          isDismissible
          onOdsDismiss={() => setIsWarningDismissed(true)}
        >
          <p className="my-0">{t('nasha_dashboard_partition_snapshots_warning_1')}</p>
          <p className="my-0">{t('nasha_dashboard_partition_snapshots_warning_2')}</p>
        </Message>
      )}

      {/* Snapshots Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold border-b">
                {t('nasha_dashboard_partition_snapshots_list_type')}
              </th>
              <th className="p-3 text-left font-semibold border-b">
                {t('nasha_dashboard_partition_snapshots_list_name')}
              </th>
              <th className="p-3 text-left font-semibold border-b">
                {t('nasha_dashboard_partition_snapshots_list_options')}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Frequencies Row */}
            <tr className="border-b">
              <td className="p-3">
                {t('nasha_dashboard_partition_snapshots_list_snapshot_types')}
              </td>
              <td className="p-3">-</td>
              <td className="p-3">
                <div className="flex justify-between items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={BUTTON_VARIANT.outline} color={BUTTON_COLOR.neutral}>
                        {readableSnapshotTypesModel}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2">
                      {snapshotTypesModel.map((snapshotType) => (
                        <div key={snapshotType.value} className="py-1">
                          <Checkbox
                            inputId={`snapshotType_${snapshotType.value}`}
                            name={`snapshotType_${snapshotType.value}`}
                            isChecked={snapshotType.enabled}
                            onOdsChange={() => handleToggleSnapshotType(snapshotType.value)}
                          >
                            {snapshotType.label}
                          </Checkbox>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-2">
                    {isUpdating && <Spinner size="sm" />}
                    <Button
                      variant={BUTTON_VARIANT.ghost}
                      color={BUTTON_COLOR.primary}
                      onClick={handleUpdateSnapshotTypes}
                      disabled={!canUpdateSnapshotTypes}
                      aria-label={t('nasha_dashboard_partition_snapshots_submit_snapshot_types')}
                    >
                      {t('nasha_dashboard_partition_snapshots_confirm')}
                    </Button>
                    <Button
                      variant={BUTTON_VARIANT.ghost}
                      color={BUTTON_COLOR.neutral}
                      onClick={handleResetSnapshotTypes}
                      disabled={!canUpdateSnapshotTypes}
                      aria-label={t('nasha_dashboard_partition_snapshots_reset_snapshot_types')}
                    >
                      {t('nasha_dashboard_partition_snapshots_cancel')}
                    </Button>
                  </div>
                </div>
              </td>
            </tr>

            {/* Custom Snapshots Rows */}
            {customSnapshots.map((snapshot) => (
              <tr key={snapshot} className="border-b">
                <td className="p-3">
                  {t('nasha_dashboard_partition_snapshots_list_custom_snapshot')}
                </td>
                <td className="p-3" colSpan={2}>
                  <div className="flex justify-between items-center">
                    <span>{snapshot}</span>
                    <Button
                      variant={BUTTON_VARIANT.ghost}
                      color={BUTTON_COLOR.critical}
                      onClick={() => handleDeleteClick(snapshot)}
                      aria-label={t('nasha_dashboard_partition_snapshots_delete')}
                    >
                      {t('nasha_dashboard_partition_snapshots_delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Custom Snapshot Form Row */}
            {isFormShown && (
              <tr className="border-b bg-gray-50">
                <td className="p-3">
                  <Text preset={TEXT_PRESET.paragraph} className="font-semibold">
                    {t('nasha_dashboard_partition_snapshots_list_custom_snapshot')}
                  </Text>
                </td>
                <td className="p-3" colSpan={2}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Text preset={TEXT_PRESET.paragraph} className="font-semibold">
                        {CUSTOM_SNAPSHOT_NAME_PREFIX}
                      </Text>
                      <Text preset={TEXT_PRESET.paragraph} className="font-semibold">
                        {CUSTOM_SNAPSHOT_NAME_SEPARATOR}
                      </Text>
                      <FormField>
                        <Input
                          type="text"
                          name="customSnapshotName"
                          value={customSnapshotName}
                          onOdsChange={(e) => setCustomSnapshotName(e.detail.value || '')}
                          className="min-w-[300px]"
                        />
                        <Text preset={TEXT_PRESET.caption} className="text-gray-500 mt-1">
                          {t('nasha_dashboard_partition_snapshots_create_rule')}
                        </Text>
                      </FormField>
                    </div>
                    <div className="flex items-center gap-2">
                      {createSnapshot.isPending && <Spinner size="sm" />}
                      <Button
                        color={BUTTON_COLOR.primary}
                        onClick={handleCreateCustomSnapshot}
                        disabled={!canCreateCustomSnapshot}
                        aria-label={t('nasha_dashboard_partition_snapshots_create')}
                      >
                        {t('nasha_dashboard_partition_snapshots_confirm')}
                      </Button>
                      <Button
                        variant={BUTTON_VARIANT.outline}
                        color={BUTTON_COLOR.neutral}
                        onClick={handleCancelForm}
                        disabled={createSnapshot.isPending}
                        aria-label={t('nasha_dashboard_partition_snapshots_hide_form')}
                      >
                        {t('nasha_dashboard_partition_snapshots_cancel')}
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Outlet for delete modal */}
      <Outlet />
    </div>
  );
}

